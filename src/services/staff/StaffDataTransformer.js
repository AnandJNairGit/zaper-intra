// src/services/staff/StaffDataTransformer.js
class StaffDataTransformer {
  /**
   * Transform raw staff data to formatted response
   * @param {Array} rawStaffData - Raw staff data from database
   * @param {Object} relatedData - Related data maps
   * @returns {Array} Formatted staff data
   */
  static transformStaffData(rawStaffData, relatedData) {
    const { 
      photosMap, 
      jobProfilesMap, 
      salariesMap, 
      tokensMap, 
      accommodationsMap, 
      communicationDetailsMap 
    } = relatedData;

    return rawStaffData.map(staff => {
      const staffData = staff.get({ plain: true });
      const user = staffData.user || {};
      const role = staffData.role || {};
      const clientInfo = staffData.client || {};
      const photos = photosMap[user.user_id] || [];
      const jobProfile = jobProfilesMap[user.user_id] || {};
      const salary = salariesMap[user.user_id] || {};
      const tokens = tokensMap[user.user_id] || [];
      const accommodations = accommodationsMap[user.user_id] || [];
      const communicationDetails = communicationDetailsMap[user.user_id] || [];

      return this.buildStaffObject(
        staffData, user, role, clientInfo, photos, 
        jobProfile, salary, tokens, accommodations, communicationDetails
      );
    });
  }

  /**
   * Build comprehensive staff object including accommodation details
   * @param {Object} staffData - Staff data
   * @param {Object} user - User data
   * @param {Object} role - Role data
   * @param {Object} clientInfo - Client data
   * @param {Array} photos - Photos array
   * @param {Object} jobProfile - Job profile data
   * @param {Object} salary - Salary data
   * @param {Array} tokens - Notification tokens array
   * @param {Array} accommodations - Accommodation details array
   * @param {Array} communicationDetails - Communication details array
   * @returns {Object} Formatted staff object
   */
  static buildStaffObject(staffData, user, role, clientInfo, photos, jobProfile, salary, tokens, accommodations, communicationDetails) {
    return {
      // Basic Information
      staff_id: staffData.staff_id,
      name: user.display_name || user.user_name || null,
      username: user.user_name || null,
      code: staffData.code || null,
      
      // Client Information
      client_id: clientInfo.client_id || null,
      client_name: clientInfo.client_name || null,
      client_region: clientInfo.region || null,
      client_currency: clientInfo.currency || null,
      
      // Employment Details
      status: staffData.current_active ? 'active' : 'inactive',
      onboard_date: staffData.joining_date || null,
      days_since_onboarding: this.calculateDaysSince(staffData.joining_date),
      
      // Role and Designation
      role_id: role.role_id || null,
      designation: role.role_name || null,
      job_profile_name: jobProfile.jobProfile?.job_profile_name || null,
      
      // Overtime Information
      ot_applicable: role.use_overtime || salary.use_overtime || false,
      ot_above_hour: role.ot_above_hour || null,
      regular_ot_rate: role.regular_ot || null,
      holiday_pay_rate: role.holiday_pay_rate || null,
      
      // Personal Information
      phone_number: user.phone_number || null,
      email: user.emailid || null,
      gender: user.gender || null,
      date_of_birth: user.date_of_birth || null,
      age: this.calculateAge(user.date_of_birth),
      religion: user.religion || null,
      
      // Professional Information
      education: user.education || null,
      skills_and_proficiency: user.skills_and_proficiency || null,
      language_spoken: user.language_spoken || null,
      skill_type: user.skill_type || jobProfile.skill_type || null,
      zaper_skills: user.zaper_skills || null,
      user_type: user.type || null,
      
      // Job Profile Details
      contract_type: jobProfile.contract_type || null,
      reporting_to: jobProfile.reporting_to || null,
      reportees: jobProfile.reportees || null,
      profile_info: jobProfile.profileinfo || null,
      
      // Face Registration
      is_face_registered: photos.length > 0,
      total_photos: photos.length,
      face_photos_count: photos.filter(p => p.photo_type === 'face').length,
      vector_saved_photos: photos.filter(p => p.saved_to_vector).length,
      
      // Benefits and Eligibility
      sick_leave_eligibility: role.sick_leave_eligibility || false,
      annual_leave_eligibility: role.annual_leave_eligibility || false,
      insurance_eligibility: role.insurance_eligibility || false,
      air_ticket_eligibility: role.air_ticket_eligibility || false,
      
      // Salary Information
      basic_salary: salary.basic_salary || null,
      take_home_salary: salary.take_home || null,
      ctc: salary.ctc || null,
      salary_currency: salary.currency || null,
      
      // Communication Details (NEW)
      communication_details: this.formatCommunicationDetails(communicationDetails),
      
      // Accommodation Details (NEW)
      accommodation_details: this.formatAccommodationDetails(accommodations),
      
      // Additional Information
      accommodation: user.description || null,
      profile_image: user.profile_image || null,
      vendor_id: staffData.vendor_id || null,
      permissions: staffData.permissions || {},
      project_permissions: staffData.project_permissions || [],
      
      // Device Information
      registered_devices: tokens.length,
      device_types: [...new Set(tokens.map(t => t.device_type))],
      last_device_registration: this.getLastDeviceRegistration(tokens),
      
      // Metadata
      record_created_at: staffData.created_at || null
    };
  }

  /**
   * Format communication details array
   * @param {Array} communicationDetails - Communication details array
   * @returns {Array} Formatted communication details
   */
  static formatCommunicationDetails(communicationDetails) {
    return communicationDetails.map(detail => ({
      communication_id: detail.communication_id,
      communication_address: detail.communication_address,
      permanent_address: detail.permanent_address,
      country: detail.country,
      state: detail.state,
      pincode: detail.pincode,
      phone_number: detail.phone_number,
      emergency_contact_name: detail.emergency_contact_name,
      emergency_contact_number: detail.emergency_contact_number,
      bus_number: detail.bus_number
    }));
  }

  /**
   * Format accommodation details array
   * @param {Array} accommodations - Accommodation details array
   * @returns {Array} Formatted accommodation details
   */
  static formatAccommodationDetails(accommodations) {
    return accommodations.map(accommodation => ({
      accommodation_id: accommodation.accommodation_id,
      location: accommodation.location,
      city: accommodation.city,
      country: accommodation.country,
      created_at: accommodation.created_at
    }));
  }

  /**
   * Calculate days since a given date
   * @param {Date} date - Date to calculate from
   * @returns {number|null} Days since date
   */
  static calculateDaysSince(date) {
    if (!date) return null;
    return Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
  }

  /**
   * Calculate age from date of birth
   * @param {Date} dateOfBirth - Date of birth
   * @returns {number|null} Age in years
   */
  static calculateAge(dateOfBirth) {
    if (!dateOfBirth) return null;
    return Math.floor((new Date() - new Date(dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000));
  }

  /**
   * Get last device registration timestamp
   * @param {Array} tokens - Notification tokens array
   * @returns {number|null} Last registration timestamp
   */
  static getLastDeviceRegistration(tokens) {
    if (tokens.length === 0) return null;
    return Math.max(...tokens.map(t => new Date(t.created_at).getTime()));
  }

  /**
   * Build summary statistics
   * @param {Array} staffDetails - Formatted staff details
   * @param {Object} clientInfo - Client information
   * @param {number} totalCount - Total staff count
   * @returns {Object} Summary statistics
   */
  static buildSummary(staffDetails, clientInfo, totalCount) {
    return {
      total_staff: totalCount,
      active_staff: staffDetails.filter(s => s.status === 'active').length,
      inactive_staff: staffDetails.filter(s => s.status === 'inactive').length,
      face_registered: staffDetails.filter(s => s.is_face_registered).length,
      ot_applicable_count: staffDetails.filter(s => s.ot_applicable).length,
      staff_with_accommodation: staffDetails.filter(s => s.accommodation_details.length > 0).length,
      client_info: {
        client_id: clientInfo.client_id,
        client_name: clientInfo.client_name
      }
    };
  }
}

module.exports = StaffDataTransformer;
