const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserSalary = sequelize.define('user_salary', {
    user_salary_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    take_home: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    basic_salary: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    ctc: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ot_above_hour: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    ot_hourly_base: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    regular_ot: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    holiday_pay_rate: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    weekend_off_day_rate: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    max_ot_per_day: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    max_ot_per_month: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    unauthorized_leaves: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    safety_violation: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    gratuity: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    sick_leave_eligibility: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    annual_leave_eligibility: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    insurance_eligibility: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    air_ticket_eligibility: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    overtime_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'client_overtimes',
        key: 'overtime_id'
      }
    },
    deduction_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'client_deductions',
        key: 'deduction_id'
      }
    },
    use_overtime: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    use_deduction: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    other_allowance: {
      type: DataTypes.DECIMAL,
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: 'user_salary'
  });

  return UserSalary;
};
