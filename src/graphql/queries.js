/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getRapCloud = /* GraphQL */ `
  query GetRapCloud($id: ID!) {
    getRapCloud(id: $id) {
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
export const listRapClouds = /* GraphQL */ `
  query ListRapClouds(
    $filter: ModelRapCloudFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRapClouds(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
