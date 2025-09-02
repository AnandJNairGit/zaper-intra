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
      const staffData = staff.get ? staff.get({ plain: true }) : staff;
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
   * ENHANCED: Build comprehensive staff object including photo URL and all filter flags
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
    // Calculate overtime eligibility
    const isOtEligible = role.use_overtime || salary.use_overtime || false;
    
    // Calculate face registration status
    const isFaceRegistered = photos.length > 0;

    // Calculate device information
    const deviceTypes = [...new Set(tokens.map(t => t.device_type))];
    const hasAndroid = deviceTypes.includes('android');
    const hasIOS = deviceTypes.includes('ios');
    const hasNoDevice = tokens.length === 0;

    // NEW: Extract photo URL - prioritize face photos, fallback to any photo
    const facePhoto = photos.find(p => p.photo_type === 'face');
    const anyPhoto = photos.length > 0 ? photos[0] : null;
    const photoUrl = facePhoto?.photo_url || anyPhoto?.photo_url || null;

    return {
      // Basic Information
      staff_id: staffData.staff_id,
      name: user.display_name || user.user_name || null,
      username: user.user_name || null,
      code: staffData.code || null,
      
      // NEW: Photo URL
      photo_url: photoUrl,
      
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
      
      // Enhanced Filter Flags
      filter_flags: {
        is_ot_eligible: isOtEligible,
        is_face_registered: isFaceRegistered,
        combinational_type: this.getCombinationalType(isOtEligible, isFaceRegistered),
        // Device filter flags
        has_android: hasAndroid,
        has_ios: hasIOS,
        has_no_device: hasNoDevice,
        device_types: deviceTypes,
        device_filter_type: this.getDeviceFilterType(hasAndroid, hasIOS, hasNoDevice)
      },
      
      // Overtime Information
      ot_applicable: isOtEligible,
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
      
      // Face Registration Details
      is_face_registered: isFaceRegistered,
      total_photos: photos.length,
      face_photos_count: photos.filter(p => p.photo_type === 'face').length,
      vector_saved_photos: photos.filter(p => p.saved_to_vector).length,
      // NEW: Enhanced photo information
      photo_details: {
        has_photo: photoUrl !== null,
        photo_url: photoUrl,
        face_photo_available: facePhoto !== null,
        face_photo_url: facePhoto?.photo_url || null,
        total_photos: photos.length,
        photo_types: [...new Set(photos.map(p => p.photo_type))]
      },
      
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
      
      // Communication Details
      communication_details: this.formatCommunicationDetails(communicationDetails),
      
      // Accommodation Details
      accommodation_details: this.formatAccommodationDetails(accommodations),
      
      // Additional Information
      accommodation: user.description || null,
      profile_image: user.profile_image || null,
      vendor_id: staffData.vendor_id || null,
      permissions: staffData.permissions || {},
      project_permissions: staffData.project_permissions || [],
      
      // Device Information
      registered_devices: tokens.length,
      device_types: deviceTypes,
      last_device_registration: this.getLastDeviceRegistration(tokens),
      
      // Metadata
      record_created_at: staffData.created_at || null
    };
  }

  /**
   * Get combinational type based on OT and face registration status
   * @param {boolean} isOtEligible - Is overtime eligible
   * @param {boolean} isFaceRegistered - Is face registered
   * @returns {string} Combinational type
   */
  static getCombinationalType(isOtEligible, isFaceRegistered) {
    if (isOtEligible && isFaceRegistered) return 'ot_with_face';
    if (isOtEligible && !isFaceRegistered) return 'ot_without_face';
    if (!isOtEligible && isFaceRegistered) return 'non_ot_with_face';
    if (!isOtEligible && !isFaceRegistered) return 'non_ot_without_face';
    return 'unknown';
  }

  /**
   * Get device filter type based on device ownership
   * @param {boolean} hasAndroid - Has Android device
   * @param {boolean} hasIOS - Has iOS device
   * @param {boolean} hasNoDevice - Has no devices
   * @returns {string} Device filter type
   */
  static getDeviceFilterType(hasAndroid, hasIOS, hasNoDevice) {
    if (hasNoDevice) return 'none';
    if (hasAndroid && hasIOS) return 'both';
    if (hasAndroid) return 'android';
    if (hasIOS) return 'ios';
    return 'unknown';
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
   * ENHANCED: Build summary statistics with photo information
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
      
      // Combinational filter statistics
      combinational_stats: {
        ot_with_face: staffDetails.filter(s => s.filter_flags.combinational_type === 'ot_with_face').length,
        ot_without_face: staffDetails.filter(s => s.filter_flags.combinational_type === 'ot_without_face').length,
        non_ot_with_face: staffDetails.filter(s => s.filter_flags.combinational_type === 'non_ot_with_face').length,
        non_ot_without_face: staffDetails.filter(s => s.filter_flags.combinational_type === 'non_ot_without_face').length,
        all_ot: staffDetails.filter(s => s.filter_flags.is_ot_eligible).length,
        all_non_ot: staffDetails.filter(s => !s.filter_flags.is_ot_eligible).length,
        all_with_face: staffDetails.filter(s => s.filter_flags.is_face_registered).length,
        all_without_face: staffDetails.filter(s => !s.filter_flags.is_face_registered).length
      },

      // Device statistics
      device_stats: {
        android_users: staffDetails.filter(s => s.filter_flags.has_android).length,
        ios_users: staffDetails.filter(s => s.filter_flags.has_ios).length,
        no_device_users: staffDetails.filter(s => s.filter_flags.has_no_device).length,
        total_devices: staffDetails.reduce((sum, s) => sum + s.registered_devices, 0),
        users_with_devices: staffDetails.filter(s => s.registered_devices > 0).length,
        users_with_both_platforms: staffDetails.filter(s => s.filter_flags.has_android && s.filter_flags.has_ios).length
      },

      // NEW: Photo statistics
      photo_stats: {
        users_with_photos: staffDetails.filter(s => s.photo_url !== null).length,
        users_without_photos: staffDetails.filter(s => s.photo_url === null).length,
        users_with_face_photos: staffDetails.filter(s => s.photo_details.face_photo_available).length,
        total_photos: staffDetails.reduce((sum, s) => sum + s.total_photos, 0),
        average_photos_per_user: totalCount > 0 ? 
          Math.round((staffDetails.reduce((sum, s) => sum + s.total_photos, 0) / totalCount) * 100) / 100 : 0
      },
      
      client_info: {
        client_id: clientInfo.client_id,
        client_name: clientInfo.client_name
      }
    };
  }
}

module.exports = StaffDataTransformer;
