import React from 'react';
import { Dropdown, message, Space } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

const ChoosePupitreType = ({ onMenuClick }) => {
  const handleMenuClick = (e) => {
    message.info(`Le Pupitre ${e.key} est séléctionné `);
    if (onMenuClick) {
      onMenuClick(e.key);
    }
  };

  const items = [
    {
      label: 'soprano',
      key: 'soprano',
      icon: <CheckOutlined />,
    },
    {
      label: 'ténor',
      key: 'ténor',
      icon: <CheckOutlined />,
    },
    {
      label: 'basse',
      key: 'basse',
      icon: <CheckOutlined />,
    },
    {
      label: 'alto',
      key: 'alto',
      icon: <CheckOutlined />,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <Space wrap>
      <Dropdown.Button menu={menuProps}>
        Choisir un Pupitre
      </Dropdown.Button>
    </Space>
  );
};

export default ChoosePupitreType;
