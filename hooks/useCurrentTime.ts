import {
    AppState,
    type AppStateStatus,
} from 'react-native';

import {
    useEffect,
    useState,
} from 'react';

export function useCurrentTime() {
  const [now, setNow] = useState(
    () => new Date(),
  );

  useEffect(() => {
    let timeoutId: ReturnType<
      typeof setTimeout
    >;

    let intervalId: ReturnType<
      typeof setInterval
    >;

    const update = () => {
      setNow(new Date());
    };

    const scheduleTimer = () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);

      const current = new Date();

      const millisecondsUntilNextMinute =
        (60 - current.getSeconds()) *
          1000 -
        current.getMilliseconds();

      timeoutId = setTimeout(() => {
        update();

        intervalId = setInterval(
          update,
          60 * 1000,
        );
      }, millisecondsUntilNextMinute);
    };

    const handleAppStateChange = (
      state: AppStateStatus,
    ) => {
      if (state === 'active') {
        update();
        scheduleTimer();
      }
    };

    scheduleTimer();

    const subscription =
      AppState.addEventListener(
        'change',
        handleAppStateChange,
      );

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      subscription.remove();
    };
  }, []);

  return now;
}