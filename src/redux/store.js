import { configureStore } from "@reduxjs/toolkit";
import { fetchPlatformDataSlice } from "./slice/plaftformDataSlice";
import {
  fetchRegisteredVesselIDSlice,
  fetchRegisteredVesselSlice,
  saveRegisteredVesselSlice,
  updateRegisteredVesselSlice,
} from "./slice/registeredVesselSlice";
import {
  fetchGeneralReportSlice,
  saveGeneralReportSlice,
} from "./slice/generalReportSlice";
import {
  loginSlice,
  registerSlice,
  getAllUsersSlice,
  getUsersIDSlice,
} from "./slice/userAuthSlice";
import { addUploadDataSlice } from "./slice/uploadData";
import { fetchVisReportSlice, fetchVisCrewSlice, fetchChallanWarningSlice } from "./slice/visReportSlice";
import { fetchRegisteredMerchantVesselSlice, saveRegisteredMerchantVesselSlice, updateRegisteredMerchantVesselSlice
} from "./slice/registeredMerchantVesselSlice";
import {
  fetchIntelReportIDSlice,
  fetchIntelReportSlice,
  saveIntelReportSlice,
} from "./slice/intelReportSlice";
import {
  fetchMissionReporIDSlice,
  fetchMissionReporIDtSlice,
  fetchMissionReportSlice,
  saveMissionReportSlice,
} from "./slice/missionReportSlice";
import { addCosposUploadDataSlice } from "./slice/cosposUploadDataSlice";
import { addJmisLostReportUploadDataSlice } from "./slice/jmsiLostReportUploadDataSlice";
import { addPNSCUploadDataSlice } from "./slice/PNSCUploadDataSlice";
import { addSituationUploadDataSlice } from "./slice/situationReportUploadData";
import {
  fetchIntelDetailReportSlice,
  saveIntelDetailReportSlice,
} from "./slice/intelDetailDataSlice";
import {
  fetchShipBreakingnReportSlice,
  saveShipBreakingReportSlice,
} from "./slice/shipbreakingReportSlice";
import { addSitutationalReportDataSlice } from "./slice/addSituationalReport";
import { addLostReportDataSlice } from "./slice/addLostReport";
import { addPnscReportDataSlice } from "./slice/addPnscReport";
import { fetchJettyDataSlice, addJettyDataSlice } from "./slice/jettyDataSlice";
import { fetchMerchantVesselDetailsSlice } from "./slice/merchatDetailsDataSlice";
import { fetchFishingVesselReportSlice, fetchFishingVesselSlice } from "./slice/fishingVesselSlice";
import { fetchMerchantVesselReportSlice, fetchMerchantVesselSlice, fetchMerchantRoutesDataSlice } from "./slice/merchantVesselSlice";
import { fetchPatroltypeBasedDataSlice, fetchPlatformnameBasedDataSlice, fetchCoiBasedDataSlice, fetchStaticSpecialReportDataSlice, fetchMultiplePatroltypeBasedDataSlice } from "./slice/patroltypeBasedDataSlice";
import { addCOIReportUploadDataSlice, fetchCoiVesselReportSlice, addCOIReportDataSlice } from "./slice/coiVesselSlice";
import { fetchSARDataSlice, addSARDataSlice, fetchSARFormDataSlice, fetchMedicalAssistanceDataSlice, addMedicalAssistanceDataSlice } from "./slice/sarDataSlice"; 
import {fetchCargoDhowDataSlice} from "./slice/cargoDhowDataSlice";
import {uploadPersonImageSlice} from "./slice/facialRecognitionDataSlice";

const store = configureStore({
  reducer: {
    fetchPlatformData: fetchPlatformDataSlice.reducer,
    fetchJettyData: fetchJettyDataSlice.reducer,
    upload: addUploadDataSlice.reducer,
    cospos: addCosposUploadDataSlice.reducer,
    lostreport: addJmisLostReportUploadDataSlice.reducer,
    pnsc: addPNSCUploadDataSlice.reducer,
    situationreport: addSituationUploadDataSlice.reducer,
    coireport: addCOIReportDataSlice.reducer,
    fetchVisData: fetchVisReportSlice.reducer,
    fetchVisCrew :fetchVisCrewSlice.reducer, 
    fetchChallans :fetchChallanWarningSlice.reducer,
    // addPlatformData: addPlatformDataSlice.reducer,
    fetchRegisteredVesselData: fetchRegisteredVesselSlice.reducer,
    saveRegisteredVesselData: saveRegisteredVesselSlice.reducer,
    updateRegisteredVessel: updateRegisteredVesselSlice.reducer,
    fetchRegisteredVesselIDData:fetchRegisteredVesselIDSlice.reducer,
    fetchRegisteredMerchantVesselData:  fetchRegisteredMerchantVesselSlice.reducer,
    // updateRegisteredMerchantVesselData:  updateRegisteredMerchantVesselSlice.reducer,
    saveRegisteredMerchantVesselData: saveRegisteredMerchantVesselSlice.reducer,
    fetchMerchantVesselDetails: fetchMerchantVesselDetailsSlice.reducer,
    // fetchRegistedVesselById: fetchRegistedVesselByIdSlice.reducer,
    fetchGeneralReport: fetchGeneralReportSlice.reducer,
    fetchIntelReport: fetchIntelReportSlice.reducer,
    fetchIntelReportID:fetchIntelReportIDSlice.reducer,
    fetchIntelDetailReport: fetchIntelDetailReportSlice.reducer,
    fetchMissionReport: fetchMissionReportSlice.reducer,
    fetchMissionReportID:fetchMissionReporIDSlice.reducer,
    fetchShipBreakingReport: fetchShipBreakingnReportSlice.reducer,
    // fetchGeneralById: fetchGeneralReportByIdSlice.reducer,
    fetchMerchantVessel: fetchMerchantVesselSlice.reducer,
    fetchMerchantRoutesData: fetchMerchantRoutesDataSlice.reducer,
    fetchFishingVessel: fetchFishingVesselSlice.reducer,
    fetchFishingVesselReport:fetchFishingVesselReportSlice.reducer,
    fetchMerchantVesselReport:fetchMerchantVesselReportSlice.reducer,
    
    fetchPatroltypeBasedData:fetchPatroltypeBasedDataSlice.reducer,
    fetchMultiplePatroltypeBasedData:fetchMultiplePatroltypeBasedDataSlice.reducer,
    fetchPlatformnameBasedData: fetchPlatformnameBasedDataSlice.reducer,
    fetchCoiData: fetchCoiBasedDataSlice.reducer,
    fetchStaticSpecialReportData: fetchStaticSpecialReportDataSlice.reducer,
    fetchCoiVesselReport: fetchCoiVesselReportSlice.reducer,
    fetchSARData: fetchSARDataSlice.reducer,
    fetchMedicalAssistanceData: fetchMedicalAssistanceDataSlice.reducer,
    addSARData: addSARDataSlice.reducer,
    addMedicalAssistanceData: addMedicalAssistanceDataSlice.reducer,
    fetchCargoDhowData: fetchCargoDhowDataSlice.reducer,
    
    loginAuth: loginSlice.reducer,
    register: registerSlice.reducer,
    fetchUserID:getUsersIDSlice.reducer,
    saveGeneralReport: saveGeneralReportSlice.reducer,
    saveIntelReport: saveIntelReportSlice.reducer,
    saveIntelDetailReport: saveIntelDetailReportSlice.reducer,
    saveMissionReport: saveMissionReportSlice.reducer,
    saveShipBreakingReport: saveShipBreakingReportSlice.reducer,
    getUsers: getAllUsersSlice.reducer,

    faceDetection: uploadPersonImageSlice.reducer,
    
    addCoiReport: addCOIReportUploadDataSlice.reducer,
    addSituationalReport: addSitutationalReportDataSlice.reducer,
    addLostReport: addLostReportDataSlice.reducer,
    addPnscReport: addPnscReportDataSlice.reducer,
  },
});

export default store;
