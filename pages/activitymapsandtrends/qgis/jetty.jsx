import React from 'react';
import { useRouter } from 'next/router';
import QWC_THEMES from '../../../config';

const QWC2Map = () => {
  const router = useRouter();
  const { t } = router.query; // Read 't' from query parameters

  const qwcUrl = `${process.env.NEXT_PUBLIC_QWC2_SERVER_DATA_ENDPOINT}/?t=${t}`; // QGIS Web Client URL
  const themeName = QWC_THEMES.jettyPak;
//&f=narco:"flag"='Irani'
  return (
    <iframe
      src={t ? qwcUrl : `${process.env.NEXT_PUBLIC_QWC2_SERVER_DATA_ENDPOINT}/?t=${themeName}`}
      style={{ width: '100%', height: '100%', border: 'none' }}
      title="QGIS Web Client 2"
      allow="clipboard-write; clipboard-read"
    />
  );
};

export default QWC2Map;