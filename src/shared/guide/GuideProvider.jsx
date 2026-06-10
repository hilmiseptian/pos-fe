import { useEffect, useRef } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import './guide.css';
import { useFirstTimeGuide } from './useFirstTimeGuide';
import { GUIDE_STEPS, GUIDE_FINAL_STEP } from './guideConfig';

export function GuideProvider({ children }) {
  const { shouldShow, isLoading, markAsSeen } = useFirstTimeGuide();
  const driverRef = useRef(null);

  useEffect(() => {
    if (!shouldShow || isLoading) return;

    let clickHandler = null;

    // Delay ensures sidebar elements are fully painted
    const timer = setTimeout(() => {
      // Only include steps whose target element is rendered (respects permissions)
      const validSteps = GUIDE_STEPS.filter(
        ({ id }) => !!document.querySelector(`[data-guide-id="${id}"]`),
      ).map(({ id, popover }) => ({
        element: `[data-guide-id="${id}"]`,
        popover: { ...popover, side: 'right', align: 'start' },
      }));

      // Nothing to highlight — skip and mark done
      if (validSteps.length === 0) {
        markAsSeen();
        return;
      }

      const steps = [
        ...validSteps,
        { popover: { ...GUIDE_FINAL_STEP.popover, align: 'center' } },
      ];

      const driverObj = driver({
        animate: true,
        allowClose: false,
        overlayOpacity: 0.65,
        stagePadding: 10,
        stageRadius: 8,
        showProgress: true,
        progressText: 'Langkah {{current}} dari {{total}}',
        nextBtnText: 'Lanjut →',
        prevBtnText: '← Kembali',
        doneBtnText: '✓ Mulai',
        onDestroyed: () => markAsSeen(),
        steps,
      });

      driverRef.current = driverObj;

      // Click anywhere outside the popover → advance to next step
      clickHandler = (e) => {
        if (!driverRef.current?.isActive()) return;
        // Let Driver.js own buttons handle themselves
        if (e.target.closest('.driver-popover')) return;
        // Prevent navigation/default actions during the guide
        e.preventDefault();
        e.stopImmediatePropagation();
        driverRef.current.moveNext();
      };

      document.addEventListener('click', clickHandler, true);
      driverObj.drive();
    }, 600);

    return () => {
      clearTimeout(timer);
      if (clickHandler) {
        document.removeEventListener('click', clickHandler, true);
      }
      driverRef.current?.destroy();
      driverRef.current = null;
    };
  }, [shouldShow, isLoading, markAsSeen]);

  return <>{children}</>;
}
