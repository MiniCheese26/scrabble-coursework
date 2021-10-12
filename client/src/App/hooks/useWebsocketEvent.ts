import {EventEmitter} from 'events';
import {useEffect, useRef, useState} from 'react';

export default function useWebsocketEvent<T>(emitter: EventEmitter, initialState?: T, transformer?: (data: T) => T, event = 'update') {
  const [data, setData] = useState<T | undefined>(initialState);

  const listener = (data: T) => {
    if (transformer) {
      data = transformer(data);
    }

    setData(() => data);
  };

  useEffect(() => {
    emitter.on(event, listener);

    return () => {
      emitter.removeListener(event, listener);
    };
  });

  return data;
}

export function useWebsocketEventVariedIO<T, U>(emitter: EventEmitter, transformer: (data: T) => U, initialState?: U, event = 'update') {
  const [data, setData] = useState<U | undefined>(initialState);

  const listener = (data: T) => {
    setData(() => transformer(data));
  };

  useEffect(() => {
    emitter.on(event, listener);

    return () => {
      emitter.removeListener(event, listener);
    };
  });

  return data;
}

export function useWebsocketEventRef<T>(emitter: EventEmitter, initialState?: T, transformer?: (data: T) => T, event = 'update') {
  const data = useRef<T | undefined>(initialState);

  const listener = (newData: T) => {
    if (transformer) {
      newData = transformer(newData);
    }

    data.current = newData;
  };

  useEffect(() => {
    emitter.on(event, listener);

    return () => {
      emitter.removeListener(event, listener);
    };
  });

  return data;
}
