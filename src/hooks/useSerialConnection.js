import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to manage Web Serial API connection and simulation mode.
 * Simulates serial input using regular keyboard when hardware isn't connected.
 *
 * @param {Function} onCharReceived - callback for each key press resolved char
 */
export function useSerialConnection(onCharReceived) {
  const [isConnected, setIsConnected] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [lastChar, setLastChar] = useState(null);
  const [rawOutput, setRawOutput] = useState(''); // for debugging/status

  const portRef = useRef(null);
  const readerRef = useRef(null);

  // Fallback simulator for demo purposes without hardware
  useEffect(() => {
    if (isConnected || !isSimulating) return;

    const handleKeyDown = (e) => {
      // Prevent capturing meta keys or functional keys
      if (e.ctrlKey || e.metaKey || e.altKey || e.key.length > 1) {
        return;
      }

      // Convert layout to hardware style: we only receive lower-case letters and spaces
      let char = e.key.toLowerCase();
      if (char === ' ') char = ' ';

      // Simulate a small delay for hardware realism
      setTimeout(() => {
        handleIncomingData(char);
      }, 50);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isConnected, isSimulating]);

  const toggleSimulation = () => {
    setIsSimulating(!isSimulating);
  };

  const handleIncomingData = (char) => {
    setLastChar(char);
    if (onCharReceived) onCharReceived(char);
  };

  // Connect via Web Serial
  const connect = async () => {
    try {
      if (!('serial' in navigator)) {
        alert('Web Serial API is not supported in this browser. Use Chrome or Edge.');
        return;
      }

      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      portRef.current = port;

      const textDecoder = new TextDecoderStream();
      port.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();
      readerRef.current = reader;

      setIsConnected(true);
      setIsSimulating(false); // disable sim if hardware connects
      setRawOutput('Connected...\n');

      readLoop(reader);
    } catch (e) {
      console.error('Serial connection error:', e);
      if (e.name === 'NotFoundError') {
        // User cancelled port selection
        setRawOutput('Port selection cancelled.\n');
      } else {
        alert('Could not connect to the device. ' + e.message);
      }
    }
  };

  // Disconnect
  const disconnect = async () => {
    try {
      if (readerRef.current) {
        await readerRef.current.cancel();
        readerRef.current = null;
      }
      if (portRef.current) {
        await portRef.current.close();
        portRef.current = null;
      }
      setIsConnected(false);
      setRawOutput('Disconnected.\n');
    } catch (e) {
      console.error('Serial disconnect error:', e);
    }
  };

  // Background read loop
  const readLoop = async (reader) => {
    let buffer = '';
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += value;
        let lines = buffer.split('\n');

        // Process all complete lines
        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].replace('\r', '').trim();
          if (line.length === 1 || line === ' ') {
            handleIncomingData(line);
          }
        }

        // Keep the incomplete part
        buffer = lines[lines.length - 1];
      }
    } catch (e) {
      console.error('Read loop error:', e);
    } finally {
      setIsConnected(false);
    }
  };

  return {
    isConnected,
    isSimulating,
    lastChar,
    rawOutput,
    connect,
    disconnect,
    toggleSimulation
  };
}
