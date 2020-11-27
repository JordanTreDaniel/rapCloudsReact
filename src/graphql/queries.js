/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getRapCloud = /* GraphQL */ `
  query GetRapCloud($id: ID!) {
    getRapCloud(id: $id) {
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
      createdAt
      updatedAt
    }
  }
`;
export const listRapClouds = /* GraphQL */ `
  query ListRapClouds(
    $filter: ModelRapCloudFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRapClouds(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
