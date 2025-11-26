import meetApi from "./meet";

/**
 * Meetings module - API wrappers for meeting-related endpoints.
 */

/**
 * Create a new meeting.
 * 
 * @param {string} hostId - ID of the host user
 * @param {string} title - Title of the meeting
 * @returns {Promise<any>} Meeting data with meetingId
 */
export async function createMeeting(hostId: string, title: string) {
  try {
    const res = await meetApi.post("/meet/create", { hostId, title });
    return res.data;
  } catch (err) {
    throw (err as any)?.response?.data ?? err;
  }
}

/**
 * Join an existing meeting.
 * 
 * @param {string} meetingId - ID of the meeting to join
 * @param {string} userId - ID of the user joining
 * @returns {Promise<any>} Updated participants list
 */
export async function joinMeeting(meetingId: string, userId: string) {
  try {
    const res = await meetApi.post("/meet/join", { meetingId, userId });
    return res.data;
  } catch (err) {
    throw (err as any)?.response?.data ?? err;
  }
}

/**
 * Get meeting details.
 * 
 * @param {string} meetingId - ID of the meeting
 * @returns {Promise<any>} Meeting data
 */
export async function getMeeting(meetingId: string) {
  try {
    const res = await meetApi.get(`/meet/${meetingId}`);
    return res.data;
  } catch (err) {
    throw (err as any)?.response?.data ?? err;
  }
}

/**
 * Get participants of a meeting.
 * 
 * @param {string} meetingId - ID of the meeting
 * @returns {Promise<any>} Participants list and count
 */
export async function getParticipants(meetingId: string) {
  try {
    const res = await meetApi.get(`/meet/${meetingId}/participants`);
    return res.data;
  } catch (err) {
    throw (err as any)?.response?.data ?? err;
  }
}

/**
 * End a meeting.
 * 
 * @param {string} meetingId - ID of the meeting to end
 * @returns {Promise<any>} Success message
 */
export async function endMeeting(meetingId: string) {
  try {
    const res = await meetApi.patch(`/meet/${meetingId}/end`);
    return res.data;
  } catch (err) {
    throw (err as any)?.response?.data ?? err;
  }
}