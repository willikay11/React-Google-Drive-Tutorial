import React, { useState } from 'react';
import { Row, Col, Spin } from 'antd';
import styled from 'styled-components';
import { gapi } from 'gapi-script';
import GoogleDriveImage from '../../assets/images/google-drive.png';
import ListDocuments from '../ListDocuments';
import { style } from './styles';

const NewDocumentWrapper = styled.div`
  ${style}
`;

// Client ID and API key from the Developer Console
const CLIENT_ID = process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_DRIVE_API_KEY;

// Array of API discovery doc URLs for APIs
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';

const SelectSource = () => {
  const [listDocumentsVisible, setListDocumentsVisibility] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [isLoadingGoogleDriveApi, setIsLoadingGoogleDriveApi] = useState(false);
  const [isFetchingGoogleDriveFiles, setIsFetchingGoogleDriveFiles] = useState(false);
  const [signedInUser, setSignedInUser] = useState();
  const handleChange = (file) => {};

  /**
   * Print files.
   */
  const listFiles = (searchTerm = null) => {
    setIsFetchingGoogleDriveFiles(true);
    gapi.client.drive.files
      .list({
        pageSize: 10,
        fields: 'nextPageToken, files(id, name, mimeType, modifiedTime)',
        q: searchTerm,
      })
      .then(function (response) {
        setIsFetchingGoogleDriveFiles(false);
        setListDocumentsVisibility(true);
        const res = JSON.parse(response.body);
        setDocuments(res.files);
      });
  };

  /**
   *  Sign in the user upon button click.
   */
  const handleAuthClick = (event) => {
    gapi.auth2.getAuthInstance().signIn();
  };

  /**
   *  Called when the signed in status changes, to update the UI
   *  appropriately. After a sign-in, the API is called.
   */
  const updateSigninStatus = (isSignedIn) => {
    if (isSignedIn) {
      // Set the signed in user
      setSignedInUser(gapi.auth2.getAuthInstance().currentUser.je.Qt);
      setIsLoadingGoogleDriveApi(false);
      // list files if user is authenticated
      listFiles();
    } else {
      // prompt user to sign in
      handleAuthClick();
    }
  };

  /**
   *  Sign out the user upon button click.
   */
  const handleSignOutClick = (event) => {
    setListDocumentsVisibility(false);
    gapi.auth2.getAuthInstance().signOut();
  };

  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */
  const initClient = () => {
    setIsLoadingGoogleDriveApi(true);
    gapi.client
      .init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })
      .then(
        function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        },
        function (error) {}
      );
  };

  const handleClientLoad = () => {
    gapi.load('client:auth2', initClient);
  };

  const showDocuments = () => {
    setListDocumentsVisibility(true);
  };

  const onClose = () => {
    setListDocumentsVisibility(false);
  };

  return (
    <NewDocumentWrapper>
      <Row gutter={16} className="custom-row">
        <ListDocuments
          visible={listDocumentsVisible}
          onClose={onClose}
          documents={documents}
          onSearch={listFiles}
          signedInUser={signedInUser}
          onSignOut={handleSignOutClick}
          isLoading={isFetchingGoogleDriveFiles}
        />
        <Col span={8}>
          <Spin spinning={isLoadingGoogleDriveApi} style={{ width: '100%' }}>
            <div onClick={() => handleClientLoad()} className="source-container">
              <div className="icon-container">
                <div className="icon icon-success">
                  <img height="80" width="80" src={GoogleDriveImage} />
                </div>
              </div>
              <div className="content-container">
                <p className="title">Google Drive</p>
                <span className="content">Import documents straight from your google drive</span>
              </div>
            </div>
          </Spin>
        </Col>
      </Row>
    </NewDocumentWrapper>
  );
};

export default SelectSource;
