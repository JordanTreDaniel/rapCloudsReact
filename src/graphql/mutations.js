/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createRapCloud = /* GraphQL */ `
  mutation CreateRapCloud(
    $input: CreateRapCloudInput!
    $condition: ModelRapCloudConditionInput
  ) {
    createRapCloud(input: $input, condition: $condition) {
      artistIds
      description
      id
      maskId
      settings {
        backgroundColor
        collocations
        coloredBackground
        colorFromMask
        colors
        contour
        contourColor
        contourWidth
        detectEdges
        downSample
        height
        includeNumbers
        maskAsBackground
        maskDesired
        maskId
        repeat
        stopWords
        transparentBackground
        useCustomColors
        useRandomColors
        whiteThreshold
        width
        private
      }
      songIds
      userEmail
      filePath
      viewingUrl
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
      artistIds
      description
      id
      maskId
      settings {
        backgroundColor
        collocations
        coloredBackground
        colorFromMask
        colors
        contour
        contourColor
        contourWidth
        detectEdges
        downSample
        height
        includeNumbers
        maskAsBackground
        maskDesired
        maskId
        repeat
        stopWords
        transparentBackground
        useCustomColors
        useRandomColors
        whiteThreshold
        width
        private
      }
      songIds
      userEmail
      filePath
      viewingUrl
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
      artistIds
      description
      id
      maskId
      settings {
        backgroundColor
        collocations
        coloredBackground
        colorFromMask
        colors
        contour
        contourColor
        contourWidth
        detectEdges
        downSample
        height
        includeNumbers
        maskAsBackground
        maskDesired
        maskId
        repeat
        stopWords
        transparentBackground
        useCustomColors
        useRandomColors
        whiteThreshold
        width
        private
      }
      songIds
      userEmail
      filePath
      viewingUrl
      createdAt
      updatedAt
    }
  }
`;
