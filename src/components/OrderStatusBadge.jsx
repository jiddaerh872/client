import React from 'react';
import { FaClock, FaUtensils, FaTruck, FaCheckCircle } from 'react-icons/fa';

export function OrderStatusBadge({ status }) {
  let icon = <FaClock size={13} />;
  let className = 'status-preparing';

  switch (status) {
    case 'Preparing':
      icon = <FaUtensils size={13} />;
      className = 'status-preparing';
      break;
    case 'Ready for Pickup':
      icon = <FaTruck size={13} />;
      className = 'status-preparing';
      break;
    case 'Delivered':
      icon = <FaCheckCircle size={13} />;
      className = 'status-delivered';
      break;
    default:
      icon = <FaClock size={13} />;
      className = 'status-preparing';
  }

  return (
    <span className={`status-badge ${className}`}>
      {icon}
      <span>{status}</span>
    </span>
  );
}
