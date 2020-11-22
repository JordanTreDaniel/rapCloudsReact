/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createRapCloud = /* GraphQL */ `
  mutation CreateRapCloud(
    $input: CreateRapCloudInput!
    $condition: ModelRapCloudConditionInput
  ) {
    createRapCloud(input: $input, condition: $condition) {
      id
      songIds
      artistIds
      maskId
      userId
      private
      settings {
        id
        width
        height
        maskDesired
        maskId
        contour
        contourWidth
        contourColor
        stopWords
        backgroundColor
        coloredBackground
        transparentBackground
        maskAsBackground
        useCustomColors
        useRandomColors
        colorFromMask
        colors
        repeat
        collocations
        includeNumbers
        detectEdges
        downSample
        whiteThreshold
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateRapCloud = /* GraphQL */ `
  mutation UpdateRapCloud(
    $input: UpdateRapCloudInput!
    $condition: ModelRapCloudConditionInput
  ) {
    updateRapCloud(input: $input, condition: $condition) {
      id
      songIds
      artistIds
      maskId
      userId
      private
      settings {
        id
        width
        height
        maskDesired
        maskId
        contour
        contourWidth
        contourColor
        stopWords
        backgroundColor
        coloredBackground
        transparentBackground
        maskAsBackground
        useCustomColors
        useRandomColors
        colorFromMask
        colors
        repeat
        collocations
        includeNumbers
        detectEdges
        downSample
        whiteThreshold
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteRapCloud = /* GraphQL */ `
  mutation DeleteRapCloud(
    $input: DeleteRapCloudInput!
    $condition: ModelRapCloudConditionInput
  ) {
    deleteRapCloud(input: $input, condition: $condition) {
      id
      songIds
      artistIds
      maskId
      userId
      private
      settings {
        id
        width
        height
        maskDesired
        maskId
        contour
        contourWidth
        contourColor
        stopWords
        backgroundColor
        coloredBackground
        transparentBackground
        maskAsBackground
        useCustomColors
        useRandomColors
        colorFromMask
        colors
        repeat
        collocations
        includeNumbers
        detectEdges
        downSample
        whiteThreshold
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const createRapCloudSettings = /* GraphQL */ `
  mutation CreateRapCloudSettings(
    $input: CreateRapCloudSettingsInput!
    $condition: ModelRapCloudSettingsConditionInput
  ) {
    createRapCloudSettings(input: $input, condition: $condition) {
      id
      width
      height
      maskDesired
      maskId
      contour
      contourWidth
      contourColor
      stopWords
      backgroundColor
      coloredBackground
      transparentBackground
      maskAsBackground
      useCustomColors
      useRandomColors
      colorFromMask
      colors
      repeat
      collocations
      includeNumbers
      detectEdges
      downSample
      whiteThreshold
      createdAt
      updatedAt
    }
  }
`;
export const updateRapCloudSettings = /* GraphQL */ `
  mutation UpdateRapCloudSettings(
    $input: UpdateRapCloudSettingsInput!
    $condition: ModelRapCloudSettingsConditionInput
  ) {
    updateRapCloudSettings(input: $input, condition: $condition) {
      id
      width
      height
      maskDesired
      maskId
      contour
      contourWidth
      contourColor
      stopWords
      backgroundColor
      coloredBackground
      transparentBackground
      maskAsBackground
      useCustomColors
      useRandomColors
      colorFromMask
      colors
      repeat
      collocations
      includeNumbers
      detectEdges
      downSample
      whiteThreshold
      createdAt
      updatedAt
    }
  }
`;
export const deleteRapCloudSettings = /* GraphQL */ `
  mutation DeleteRapCloudSettings(
    $input: DeleteRapCloudSettingsInput!
    $condition: ModelRapCloudSettingsConditionInput
  ) {
    deleteRapCloudSettings(input: $input, condition: $condition) {
      id
      width
      height
      maskDesired
      maskId
      contour
      contourWidth
      contourColor
      stopWords
      backgroundColor
      coloredBackground
      transparentBackground
      maskAsBackground
      useCustomColors
      useRandomColors
      colorFromMask
      colors
      repeat
      collocations
      includeNumbers
      detectEdges
      downSample
      whiteThreshold
      createdAt
      updatedAt
    }
  }
`;
