import React from 'react'

const AdminPanelStatCard = ({icon , background , color , label , value , id}) => {
  return (
    <>
     <div className="ap-stat-card">
                <div
                  className="ap-stat-card__icon"
                  style={{ background: background }}
                >
                  <i
                    className={icon}
                    style={{ color: color }}
                  ></i>
                </div>
                <div className="ap-stat-card__info">
                  <p className="ap-stat-card__label">{label}</p>
                  <p className="ap-stat-card__value" id={id}>
                    {value}
                  </p>
                </div>
              </div>
    </>
  )
}

export default AdminPanelStatCard