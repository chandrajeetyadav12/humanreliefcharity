import React from 'react'

export const AvedanCard = ({ title, value, icon, color }) => {
  return (
    <div className="col-xl-3 col-lg-4 col-md-6 col-12">
      <div className="card shadow-sm border-0 h-100">
        <div className="card-body text-center">
          <div className={`text-${color} mb-2`} style={{ fontSize: 26 }}>
            {icon}
          </div>
          <h6 className="text-muted">{title}</h6>
          <h3 className="fw-bold">{value}</h3>
        </div>
      </div>
    </div>
  );
}
