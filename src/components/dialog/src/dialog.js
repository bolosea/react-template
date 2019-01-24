import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import './dialog.less';

const Dialog = ({ message, dialogWidth, dialogHeight, dialogButton }) => {
    return (
        <div className="dialog-mask">
            <div className="dialog-container" style={{width: dialogWidth, height: dialogHeight}}>
                <div className="dialog-title">
                    <span>操作提示</span>
                </div>
                <div className="dialog-message">
                    <span>{message}</span>
                </div>
                <div className="dialog-button">
                    {dialogButton && 
                        dialogButton.map((item, i) => {
                            return <Button type={item.type} key={i} className="btn" onClick={item.clickHandle}>{item.text}</Button>;
                        })
                    }
                </div>
            </div>
        </div>
    );
}

Dialog.propTypes = {
    message: PropTypes.string,
    dialogWidth: PropTypes.string,
    dialogHeight: PropTypes.string,
    dialogButton: PropTypes.arrayOf(PropTypes.object)
};

Dialog.initInstance = (properties) => {
    let props = properties || {};
    let div = document.createElement('div');
    document.body.appendChild(div);
    ReactDOM.render(React.createElement(Dialog, props), div);
    
    return {
        destroy() {
            ReactDOM.unmountComponentAtNode(div);
            document.body.removeChild(div);
        },
    };
};

export default Dialog; 