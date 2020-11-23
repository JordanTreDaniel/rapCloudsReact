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
      }
      createdAt
      updatedAt
    }
  }
`;
