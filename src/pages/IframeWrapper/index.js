import React, { useEffect, useState } from 'react';

const IframeWrapper = (props) => {
  const [link, setLink] = useState(null);

  useEffect(() => {
    console.log('props', props);
    if (
      props.location != null &&
      props.location.query != null &&
      props.location.query.link != null
    ) {
      setLink(null);
      setLink((i) => props.location.query.link + '?full_screen=true');
    }
  }, [props.location.query.link]);

  useEffect(() => {
    if (link != null) {
      console.log('link', link);
    }
  }, [link]);

  return (
    <div
      style={{
        width: 'calc(100% + 48px)',
        height: 'calc(100% + 48px)',
        position: 'relative',
        top: '-30px',
        left: '-24px',
      }}
    >
      {link != null && (
        <iframe src={link} frameBorder="0" style={{ width: '100%', height: '100%' }}></iframe>
      )}
    </div>
  );
};

export default IframeWrapper;
