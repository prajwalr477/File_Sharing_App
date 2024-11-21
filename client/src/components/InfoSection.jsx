import React from "react";
import '../pages/text.css';

const InfoSection = () => {
  return (
    <>
      {/* Bottom Divider */}
      <div className="main-bottom"></div>

      {/* Informational Section */}
      <section className="info-section">
        <div className="what">
          <div className="head">
            <h1>Why Accio?</h1>
          </div>

          <div className="content">
            <cite>
              We are a free and independent peer-to-peer (P2P) file-sharing service that prioritizes your privacy and keeps your data safe. 
              We store nothing online: simply close your browser to stop sending. Our mission is to make sure people keep their data safely in their own hands, as it should be.
            </cite>
          </div>
        </div>

        <div className="divider-orange"></div>

        {/* File Sharing Info */}
        <div className="item-info">
          <div className="container-circle-icon">☁️</div>
          <div className="block-info">
            <h3>Files are shared straight from your device</h3>
            <p>
              When you close the browser tab, your files are no longer accessible, minimizing the risk of anyone getting unwanted access.
            </p>
          </div>
        </div>

        {/* No Size Limits Info */}
        <div className="item-info">
          <div className="block-info">
            <h3>No more file size limits</h3>
            <p>
              Since we don’t store the data, there’s no need for file size limits. Share files of any size, keeping an eye on your own data usage.
            </p>
          </div>
          <div className="container-circle-icon">📏</div>
        </div>

        {/* Encrypted Access Info */}
        <div className="item-info">
          <div className="container-circle-icon">🔒</div>
          <div className="block-info">
            <h3>Only the receiver can access your files</h3>
            <p>
              Your data is encrypted end-to-end and can only be read by your receiver (and you, of course).
            </p>
          </div>
        </div>

        {/* Environmental Impact Info */}
        <div className="item-info">
          <div className="block-info">
            <h3>Low environmental impact</h3>
            <p>
              Because we don’t store data, we don’t need bulky servers, saving a lot of energy and reducing your carbon footprint.
            </p>
          </div>
          <div className="container-circle-icon">🌳</div>
        </div>

        <div className="divider-orange"></div>
      </section>
    </>
  );
};

export default InfoSection;
