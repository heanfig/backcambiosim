import { HttpStatus } from '@nestjs/common';
import { MsgValidatePin, TypeContacts } from './enum/request-method.enum';
import { ResponseCodeMessage } from './enum/response-code.enum';

export class HandleError {
  httpCodesError = [
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
    HttpStatus.NOT_FOUND,
    HttpStatus.INTERNAL_SERVER_ERROR,
    HttpStatus.SERVICE_UNAVAILABLE,
  ];

  processError(data) {
    if (this.httpCodesError.includes(data.statusCode)) {
      return this.errorResponse();
    }

    return {
      error: data.code == '0' ? 0 : 1,
      response:
        data.code == '0'
          ? data
          : { description: ResponseCodeMessage[data.code] },
    };
  }

  validateContactsResponse(data) {
    if (data?.pinGeneratorResponse) {
      const [response] = data.pinGeneratorResponse;
      const contact_array = [];

      if (response?.isValid === 'true') {
        data?.telephoneNumbers?.map((elem) => {
          contact_array.push({ type: TypeContacts.PHONE, contact: elem });
        });

        data?.emails?.map((elem) => {
          contact_array.push({ type: TypeContacts.MAIL, contact: elem });
        });
      }

      return {
        error: response.isValid === 'true' ? 0 : 1,
        method: data?.method,
        response:
          response.isValid === 'true'
            ? contact_array
            : { description: response?.message },
      }
    }

    if (data?.response[0].result === 'ERROR') {
      return {
        error: 1,
        response: { description: data.response[0].description }
      }
    }
  }

  validatePinResponse(data: any) {
    if (data?.pinGeneratorResponse) {
      const [response] = data.pinGeneratorResponse;
      return {
        error: response.isValid == 'true' ? 0 : 1,
        response: {
          description:
            response.isValid == 'true'
              ? 'Pin Generado satisfactoriamente'
              : MsgValidatePin[response.message],
        },
      };
    }

    if (data?.response[0].result == 'ERROR') {
      return {
        error: 1,
        response: { description: data.response[0].description }
      }
    }
  }

  errorResponse() {
    return {
      error: 1,
      response: { description: 'Ha ocurrido un error' },
    };
  }
}
