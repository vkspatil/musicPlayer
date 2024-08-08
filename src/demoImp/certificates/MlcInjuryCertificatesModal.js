import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import * as React from "react";
import CancelPresentationIconButton from "../../common/components/Buttons/CancelPresentationIconButton";
import OtLayoutFile from "../OtLayoutFile";
import TextEditor from "../TextEditor";
import ImageCapture from "../TextEditor";
import WebcamCapture from "../TextEditor";
import ExternalDeviceControl from "../TextEditor";

const ModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "84%",
  height: "93%",
  bgcolor: "background.paper",
  // borderRadius: 2,
  overflowY: "auto",
  // border: "none",
  "&:focus": {
    outline: "none",
  },
};

export default function OtLayout(props) {
  const {
    open,
    handleClose,
    userActions,
    layoutEquipmentArr,
    setLayoutEquipmentArr,
    isFromForm,
    doctorDetailsArr,
    selectedRowData,
  } = props;
  console.log("LayoutEquipmentArr", selectedRowData);
  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalStyle} className="max-h-[95%] xl:max-h-[100%]">
          <div className="mx-3 mb-3 mt-2 items-center align-middle">
            <CancelPresentationIconButton
              onClick={() => {
                handleClose();
              }}
            />
            {/* <TextEditor */}
            {/* <OtLayoutFile */}
            {/* <WebcamCapture */}
            <ExternalDeviceControl
              handleClose={handleClose}
              layoutEquipmentArr={layoutEquipmentArr && layoutEquipmentArr}
              setLayoutEquipmentArr={
                setLayoutEquipmentArr && setLayoutEquipmentArr
              }
              isFromForm={isFromForm}
              doctorDetailsArr={doctorDetailsArr && doctorDetailsArr}
              selectedRowData={selectedRowData && selectedRowData}
            />
          </div>
        </Box>
      </Modal>
    </div>
  );
}
