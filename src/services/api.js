import axios from 'axios';

const BASE_URL = 'https://harf.roshan-ai.ir/api';

const JWT_TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICItYk9Yand3MGFRVGNGVDQxQ29za250UWI3d0s4eGtqMnk1dEdvUG94LTQ0In0.eyJleHAiOjE4MDk5NDA5NTAsImlhdCI6MTc3OTE4MjU1MCwianRpIjoib25ydHJvOjFmY2I4YjQ1LTNkNTYtNDNhNS04NTQ0LTk0ODU4M2QxZjhjMiIsImlzcyI6Imh0dHBzOi8vc3NvLnJvc2hhbi1haS5pci9yZWFsbXMvcm9zaGFuIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjczM2M3NzZlLTM2ZDktNDhkOS1hOTZhLTM0MWQyMWJiZjFhZSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImhhcmZfY2xpZW50Iiwic2lkIjoiZWU2ZTNhYmEtNjU1YS00YWVlLWFkZWQtMjVkNjU1OGNkOGJiIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIqIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLXJvc2hhbiIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBncm91cHMtc2NvcGUgcHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwibmFtZSI6InRlc3QwMiB0ZXN0MDIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ0ZXN0MDIxIiwiZ2l2ZW5fbmFtZSI6InRlc3QwMiIsImZhbWlseV9uYW1lIjoidGVzdDAyIiwiZW1haWwiOiJ0ZXN0MDIxQGdtYWlsLmNvbSJ9.mkltYHMc8X1A5IWoea-fK4cdNGPHpOgMu5VGJOQ5BQ6RSwkZohL_oE9-u5L46ZbXRIjFwmiF8zCvp44tOcvxsgps6-m9JLziQwgebAOXhHQDQKSo2pc9sIqta77GHbLw-INZENx8y8JlCiOiiOH6LbAMRsMB-8SAQ1FNZRpO55VRgwyY1NVbX7dFTeL5nsJvYlg0PoZxiC0S8c0EJmOebIZxhmvCDQPrMs-FtZjQgtnPlh065AUq0DsJRVadIOko9OMhhlMM1eY8V6RmwGPKrX-bJJPOc7eXCXFP5QYxRt7JlFeoGSEpxaTxoS13mZO8eY7Av72vwwq3k-LEw-rqYA";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${JWT_TOKEN}`,
  },
});

export const transcribeFromUrl = async (mediaUrls) => {
  try {
    const response = await apiClient.post('/transcribe_files/', {
      media_urls: Array.isArray(mediaUrls) ? mediaUrls : [mediaUrls],
    });
    return response.data;
  } catch (error) {
    console.error('Error transcribing URL:', error);
    throw error;
  }
};

export const transcribeFromFile = async (file ) => {
  try {
    const formData = new FormData();
    formData.append('media', file);

    const response = await apiClient.post('/transcribe_files/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error transcribing file:', error);
    throw error;
  }
};