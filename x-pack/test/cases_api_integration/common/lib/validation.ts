/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import expect from '@kbn/expect';
import { CaseResponse, CasesByAlertId } from '../../../../plugins/cases/common/api';

/**
 * Ensure that the result of the alerts API request matches with the cases created for the test.
 */
export function validateCasesFromAlertIDResponse(
  casesFromAPIResponse: CasesByAlertId,
  createdCasesForTest: CaseResponse[]
) {
  const idToTitle = new Map<string, string>(
    createdCasesForTest.map((caseInfo) => [caseInfo.id, caseInfo.title])
  );

  for (const apiResCase of casesFromAPIResponse) {
    // check that the title in the api response matches the title in the map from the created cases
    expect(apiResCase.title).to.be(idToTitle.get(apiResCase.id));
  }
}

/**
 * Compares two arrays to determine if they are sort of equal. This function returns true if the arrays contain the same
 * elements but the ordering does not matter.
 */
export function arraysToEqual(array1?: object[], array2?: object[]) {
  if (!array1 || !array2 || array1.length !== array2.length) {
    return false;
  }

  const array1AsSet = new Set(array1);
  return array2.every((item) => array1AsSet.has(item));
}
