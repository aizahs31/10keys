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
  const bluetoothDeviceRef = useRef(null);

  // Fallback simulator for demo purposes without hardware
  useEffect(() => {
    if (isConnected || !isSimulating) return;

    const handleKeyDown = (e) => {
      // Prevent capturing meta keys
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      let char;
      if (e.key === 'Backspace') {
        char = 'Backspace';
      } else if (e.key.length > 1) {
        return;
      } else {
        // Convert layout to hardware style: we only receive lower-case letters and spaces
        char = e.key.toLowerCase();
      }

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

  const onCharReceivedRef = useRef(onCharReceived);
  useEffect(() => {
    onCharReceivedRef.current = onCharReceived;
  }, [onCharReceived]);

  const handleIncomingData = (char) => {
    setLastChar(char);
    if (onCharReceivedRef.current) onCharReceivedRef.current(char);
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

  // Connect via Web Bluetooth (BLE)
  const connectBluetooth = async () => {
    try {
      if (!('bluetooth' in navigator)) {
        alert('Web Bluetooth API is not supported in this browser. Use Chrome or Edge.');
        return;
      }

      // Request either Nordic UART, HM-10, or generic Serial over BLE
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          '6e400001-b5a3-f393-e0a9-e50e24dcca9e', // Nordic UART
          '0000ffe0-0000-1000-8000-00805f9b34fb'  // HM-10 / CC2541
        ]
      });

      const server = await device.gatt.connect();

      let service, characteristic;
      try {
        // Try HM-10 / generic TTL serial first
        service = await server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');
        characteristic = await service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb');
      } catch (e1) {
        try {
          // Fall back to Nordic UART
          service = await server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e');
          characteristic = await service.getCharacteristic('6e400003-b5a3-f393-e0a9-e50e24dcca9e'); // TX
        } catch (e2) {
          throw new Error("Could not find a supported Serial/UART BLE service on this device.");
        }
      }

      let bleBuffer = '';
      characteristic.addEventListener('characteristicvaluechanged', (event) => {
        const value = event.target.value;
        const decoder = new TextDecoder('utf-8');
        const text = decoder.decode(value);
        
        bleBuffer += text;
        let lines = bleBuffer.split('\n');
        
        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].replace('\r', '').trim();
          if (line.length === 1 || line === ' ' || line === 'Backspace') {
            handleIncomingData(line);
          }
        }
        bleBuffer = lines[lines.length - 1];
      });

      await characteristic.startNotifications();

      device.addEventListener('gattserverdisconnected', () => {
        setIsConnected(false);
        setRawOutput('Bluetooth disconnected.\n');
        bluetoothDeviceRef.current = null;
      });

      bluetoothDeviceRef.current = device;
      setIsConnected(true);
      setIsSimulating(false);
      setRawOutput('Bluetooth connected...\n');

    } catch (e) {
      console.error('Bluetooth connection error:', e);
      if (e.name !== 'NotFoundError') {
        alert('Could not connect to the Bluetooth device. ' + e.message);
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
      if (bluetoothDeviceRef.current && bluetoothDeviceRef.current.gatt.connected) {
        bluetoothDeviceRef.current.gatt.disconnect();
        bluetoothDeviceRef.current = null;
      }
      setIsConnected(false);
      setRawOutput('Disconnected.\n');
    } catch (e) {
      console.error('Disconnect error:', e);
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
          if (line.length === 1 || line === ' ' || line === 'Backspace') {
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
    connectBluetooth,
    disconnect,
    toggleSimulation
  };
}
