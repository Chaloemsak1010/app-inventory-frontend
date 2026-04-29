  import React from 'react';
  import { Panel, useReactFlow, getNodesBounds, getViewportForBounds } from '@xyflow/react';

  import { toPng } from 'html-to-image';

  import { Download } from 'lucide-react';

  function downloadImage(dataUrl) {
    console.log('Downloading image...', dataUrl);
    const a = document.createElement('a');

    a.setAttribute('download', 'reactflow.png');
    a.setAttribute('href', dataUrl);
    a.click();
  }

  const imageWidth = 1024;
  const imageHeight = 768;


  function DownloadButton() {
    const { getNodes } = useReactFlow();
    const onClick = () => {
      // we calculate a transform for the nodes so that all nodes are visible
      // we then overwrite the transform of the `.react-flow__viewport` element
      // with the style option of the html-to-image library
      const nodesBounds = getNodesBounds(getNodes());
      const viewport = getViewportForBounds(nodesBounds, imageWidth, imageHeight );

      toPng(document.querySelector('.react-flow__viewport'), {
        // backgroundColor: '#1a365d',
        backgroundColor: 'white',
        width: imageWidth,
        height: imageHeight,
        style: {
          width: imageWidth,
          height: imageHeight,
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom })`,
        },
      }).then(downloadImage);
    };

    return (
        <Panel  position="bottom-right" title='Download image' className=" mr-8 mb-8 " >
          
        <button className="mr-4 lg:mr-8 mb-18 lg:mb-8 p-3 rounded-full shadow-lg bg-white hover:scale-105 transition" onClick={onClick}>
          <Download color='#009dff' className='w-4 h-4 lg:w-15 lg:h-15' />
        </button>
      </Panel>
    );
  }

  export default DownloadButton;