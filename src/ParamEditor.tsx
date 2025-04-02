import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import "./ParamEditor.css";

interface Param {
  id: number;
  name: string;
  type: "string";
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Color {
  id: number;
  name: string;
}

interface Model {
  paramValues: ParamValue[];
  colors: Color[];
}

interface Props {
  params: Param[];
  model: Model;
}

interface ParamEditorRef {
  getModel: () => Model;
}

const ParamEditor = forwardRef<ParamEditorRef, Props>((props, ref) => {
  const { params, model } = props;

  const [paramValues, setParamValues] = useState<ParamValue[]>([
    ...model.paramValues,
  ]);
  const [colors] = useState<Color[]>([...model.colors]);

  const handleParamChange = (paramId: number, value: string) => {
    const paramValueIndex = paramValues.findIndex(
      (pv) => pv.paramId === paramId
    );

    if (paramValueIndex !== -1) {
      const updatedParamValues = [...paramValues];
      updatedParamValues[paramValueIndex] = {
        ...updatedParamValues[paramValueIndex],
        value,
      };
      setParamValues(updatedParamValues);
    } else {
      setParamValues([...paramValues, { paramId, value }]);
    }
  };

  const getParamValue = (paramId: number): string => {
    const paramValue = paramValues.find((pv) => pv.paramId === paramId);
    return paramValue ? paramValue.value : "";
  };

  useImperativeHandle(ref, () => ({
    getModel: () => ({
      paramValues,
      colors,
    }),
  }));

  return (
    <div className="param-editor">
      {params.map((param) => (
        <div key={param.id} className="param-row">
          <label className="param-label">{param.name}</label>
          <input
            type="text"
            className="param-input"
            value={getParamValue(param.id)}
            onChange={(e) => handleParamChange(param.id, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
});

const ParamEditorExample: React.FC = () => {
  const exampleParams: Param[] = [
    {
      id: 1,
      name: "Назначение",
      type: "string",
    },
    {
      id: 2,
      name: "Длина",
      type: "string",
    },
  ];

  const exampleModel: Model = {
    paramValues: [
      {
        paramId: 1,
        value: "повседневное",
      },
      {
        paramId: 2,
        value: "макси",
      },
    ],
    colors: [],
  };

  const editorRef = useRef<ParamEditorRef>(null);

  const handleGetModel = () => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      console.log("Current model:", model);
      alert("Model data logged to console");
    }
  };

  return (
    <div className="example-container">
      <h2>Редактор параметров</h2>
      <ParamEditor
        ref={editorRef}
        params={exampleParams}
        model={exampleModel}
      />
      <button className="get-model-button" onClick={handleGetModel}>
        Получить модель
      </button>
    </div>
  );
};

export { ParamEditor, ParamEditorExample };
export type { Param, ParamValue, Model, Props, Color, ParamEditorRef };
