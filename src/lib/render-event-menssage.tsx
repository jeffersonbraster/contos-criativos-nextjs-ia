import { Frame } from "@gptscript-ai/gptscript";

const renderEventMenssage = (event: Frame) => {
  switch(event.type) {
    case "runStart":
      return <div>Iniciando começou ás {event.start}</div>;
    case "callStart":
      return (
        <div>
          <p>Ferramenta utilizada: {event.tool?.description}</p>
        </div>
      )
    case "callChat":
      return (
        <div>
          Chat em andamento de acordo com seu input {">>"} {String(event.input)}
        </div>
      )
    case "callProgress":
      return null;
    case "runFinish":
      return <div>Finalizado em {event.end}</div>;
    case "callSubCalls":
      return (
        <div>
          Sub-Calls em progresso:
          {event.output?.map((output, i) => (
            <div key={i}>
              <div>{output.content}</div>
              {output.subCalls && (
                Object.keys(output.subCalls).map((subCallKey) => (
                  <div key={subCallKey}>
                    <strong>SubCall {subCallKey}:</strong>
                    <div>Id da Ferramenta: {output.subCalls[subCallKey].toolID}</div>
                    <div>Input: {output.subCalls[subCallKey].input}</div>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      )
    case "callContinue":
      return (
        <div>
          Calls continues:
          {event.output?.map((output, i) => (
            <div key={i}>
              <div>{output.content}</div>
              {output.subCalls && (
                Object.keys(output.subCalls).map((subCallKey) => (
                  <div key={subCallKey}>
                    <strong>SubCall {subCallKey}:</strong>
                    <div>Id da Ferramenta: {output.subCalls[subCallKey].toolID}</div>
                    <div>Input: {output.subCalls[subCallKey].input}</div>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      )
    case "callConfirm":
      return (
        <div>
          Calls confirm:
          {event.output?.map((output, i) => (
            <div key={i}>
              <div>{output.content}</div>
              {output.subCalls && (
                Object.keys(output.subCalls).map((subCallKey) => (
                  <div key={subCallKey}>
                    <strong>SubCall {subCallKey}:</strong>
                    <div>Id da Ferramenta: {output.subCalls[subCallKey].toolID}</div>
                    <div>Input: {output.subCalls[subCallKey].input}</div>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      )
    default:
      return <pre>{JSON.stringify(event, null, 2)}</pre>
  }
}

export default renderEventMenssage;