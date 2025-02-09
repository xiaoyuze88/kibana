/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { FC, Fragment, useEffect, useState } from 'react';
import moment, { Moment } from 'moment';
import { i18n } from '@kbn/i18n';
import { EuiDatePicker, EuiDatePickerRange } from '@elastic/eui';
import { useMlContext } from '../../../../contexts/ml';

const WIDTH = '512px';

export interface TimeRange {
  start: number;
  end: number;
}

interface Props {
  setTimeRange: (d: TimeRange) => void;
  timeRange: TimeRange;
}

export const TimeRangePicker: FC<Props> = ({ setTimeRange, timeRange }) => {
  const mlContext = useMlContext();
  const dateFormat: string = mlContext.kibanaConfig.get('dateFormat');

  const [startMoment, setStartMoment] = useState<Moment | undefined>(moment(timeRange.start));
  const [endMoment, setEndMoment] = useState<Moment | undefined>(moment(timeRange.end));

  function handleChangeStart(date: Moment | null) {
    setStartMoment(date || undefined);
  }

  function handleChangeEnd(date: Moment | null) {
    setEndMoment(date || undefined);
  }

  // update the parent start and end if the timepicker changes
  useEffect(() => {
    if (startMoment !== undefined && endMoment !== undefined) {
      setTimeRange({
        start: startMoment.valueOf(),
        end: endMoment.valueOf(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startMoment, endMoment]);

  // update our local start and end moment objects if
  // the parent start and end updates.
  // this happens if the use full data button is pressed.
  useEffect(() => {
    setStartMoment(moment(timeRange.start));
    setEndMoment(moment(timeRange.end));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(timeRange)]);

  return (
    <Fragment>
      <div style={{ minWidth: WIDTH }} data-test-subj={`mlJobWizardDateRange`}>
        <EuiDatePickerRange
          fullWidth={true}
          startDateControl={
            <EuiDatePicker
              selected={startMoment}
              onChange={handleChangeStart}
              startDate={startMoment}
              endDate={endMoment}
              aria-label={i18n.translate(
                'xpack.ml.newJob.wizard.timeRangeStep.timeRangePicker.startDateLabel',
                {
                  defaultMessage: 'Start date',
                }
              )}
              showTimeSelect
              dateFormat={dateFormat}
              maxDate={endMoment}
            />
          }
          endDateControl={
            <EuiDatePicker
              selected={endMoment}
              onChange={handleChangeEnd}
              startDate={startMoment}
              endDate={endMoment}
              aria-label={i18n.translate(
                'xpack.ml.newJob.wizard.timeRangeStep.timeRangePicker.endDateLabel',
                {
                  defaultMessage: 'End date',
                }
              )}
              showTimeSelect
              dateFormat={dateFormat}
              minDate={startMoment}
            />
          }
        />
      </div>
    </Fragment>
  );
};
