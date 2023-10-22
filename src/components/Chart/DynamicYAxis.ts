/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useCallback, useMemo, useState } from "react";

const RECHART_CERTESIAN_AXIS_TICK_VALUE_SELECTOR = `.recharts-cartesian-axis-tick-value[orientation="left"],
.recharts-cartesian-axis-tick-value[orientation="right"]`;

interface Props {
  yAxisWidthModifier?: (width: number) => number;
}

interface ReturnValues {
  yAxisWidth: undefined | number;
  setChartRef: (chartRef: any) => void;
}

export function useDynamicYAxisWidth(props: void | Props): ReturnValues {
  const { yAxisWidthModifier } = props || {};
  const [yAxisWidthState, setYAxisWidthState] = useState(undefined);

  const setChartRef = useCallback(
    (chartRef: any) => {
      if (chartRef?.container != null) {
        const tickValueElements = chartRef.container.querySelectorAll(
          RECHART_CERTESIAN_AXIS_TICK_VALUE_SELECTOR,
        );
        const highestWidth = [...tickValueElements]
          .map((el) => {
            const boundingRect = el.getBoundingClientRect();
            if (boundingRect?.width != null) {
              return boundingRect.width;
            }
            return 0;
          })
          .reduce((accumulator, value) => {
            if (accumulator < value) {
              return value;
            }
            return accumulator;
          }, 0);
        setYAxisWidthState(highestWidth);
      }
    },
    [setYAxisWidthState],
  );

  const yAxisWidth = useMemo(() => {
    if (yAxisWidthModifier != null && yAxisWidthState != null) {
      return yAxisWidthModifier(yAxisWidthState);
    }
    return yAxisWidthState;
  }, [yAxisWidthModifier, yAxisWidthState]);

  return {
    yAxisWidth,
    setChartRef,
  };
}
