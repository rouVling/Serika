import { useEffect, useRef } from 'react'
import { useState } from 'react'

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (delay === null) {
      return
    }

    const id = setInterval(() => {
      savedCallback.current()
    }, delay)

    return () => {
      clearInterval(id)
    }
  }, [delay])
}

export class ExponentialTimer {
  private callback: () => void;
  private rate: number;
  private timeoutId: NodeJS.Timeout | null;
  private baseTime: number;

  constructor(callback: () => void, rate: number, baseTime: number = 0) {
    this.callback = callback;
    this.rate = rate;
    this.timeoutId = null;
    this.baseTime = baseTime;
  }

  start() {
    const nextInterval = Math.log(Math.random()) / -this.rate * 1000 + this.baseTime * 1000;
    // console.log("nextInterval: ", nextInterval)
    this.timeoutId = setTimeout(() => {
      this.callback();
      this.start();
    }, nextInterval);
  }

  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

