import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import './index.less';

const Loader = ({spinning}) => {	
	return (
		<div className={
			classnames(
				'loading',
				{'hidden': !spinning}
			)}
		>
			<span className="loadingImage"></span>
		</div>
	);
}

Loader.propTypes = {
	spinning: PropTypes.bool
}

export default Loader;