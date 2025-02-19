import { Button, Upload } from "antd";
import { Form, Input } from "antd";
import { UploadCloud } from "lucide-react";
import { Controller } from "react-hook-form";

export default function UUpload({
  type,
  name,
  uploadTitle,
  listType,
  fileList,
  max,
  disabled = false,
  required = true,
  label,
  size,
  placeholder,
  defaultValue,
  labelStyles = {},
  className,
  suffix,
  style,
  maxCount,
}) {
  const props = {
    // defaultFileList: defaultValue || [],
    name: name || "file",
    listType: listType || "picture",
    maxCount: max || 1,
    // customRequest: customRequest,
    disabled: disabled,
    // showUploadList: showUploadList,
    fileList: fileList,
  };

  console.log("===========", fileList);
  return (
    <Controller
      name={name || "file"}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          name={name || "file"}
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
          rules={[
            {
              required: required,
              message: `Please upload ${uploadTitle}`,
            },
          ]}
          style={{
            textAlign: "center",
            border: "2px dashed #D9D9D9",
            paddingBlock: "30px",
            borderRadius: "10px",
          }}
        >
          <Upload {...props} {...field}>
            <Button icon={<UploadCloud />}>Upload {uploadTitle}</Button>
          </Upload>
        </Form.Item>
      )}
    />
  );
}
