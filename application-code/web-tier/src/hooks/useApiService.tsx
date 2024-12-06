import { useEffect, useRef } from "react";
import { OptionsHttpMethods } from "src/models/optionsValues";

interface OutputProps {
    httpRequest: (method: OptionsHttpMethods, addr: string, body?: any) => any;
    cancellableHttpRequest: (method: OptionsHttpMethods, addr: string, body?: any) => any;
}
const useApiService = (): OutputProps => {
    const token = ``;
    const controller = useRef<AbortController>(new AbortController());
    const cancellableController = useRef<AbortController>();
    // let controller = new AbortController();
    // let cancellableController = null;

    useEffect(() => {
        return () => {
            if (controller.current) controller.current.abort();
            if (cancellableController.current) cancellableController.current.abort();
        }
    }, [])

    const httpRequest = (method: OptionsHttpMethods, addr: string, body?: any) => {
        const requestOptions: RequestInit = {
            method: method,
            signal: controller.current.signal,
            ...(body) && { body: JSON.stringify(body) }
        }
        return fetchSecure(addr, requestOptions)
        .then((response) => handleResponse(response)
        .catch((error) => handleError(addr, error)))
    }

    const cancellableHttpRequest = (method: OptionsHttpMethods, addr: string, body?: any) => {
        if (cancellableController.current) cancellableController.current.abort();
        cancellableController.current = new AbortController();

        const requestOptions: RequestInit = {
            method: method,
            signal: controller.current.signal,
            ...(body) && { body: JSON.stringify(body) }
        }
        return fetchSecure(addr, requestOptions)
        .then((response) => handleResponse(response)
        .catch((error) => handleError(addr, error)))
    }

    const handleResponse = async (response: Response): Promise<Response> => {
        if (response.status >= 400 && response.status <= 599) {
            await response.json().then((e) => {
                throw new Error(`${response.status}: ${e.message}`)
            })
        }
        const resp = await response.json();
        return resp;
    }

    const handleError = (addr: string, error: Error) => {
        if (error instanceof DOMException && error.name === "AbortError") {
            throw new Error("Aborted fetch request");
        }
        throw error;
    }

    const fetchSecure = async (addr: string, requestOptions: RequestInit): Promise<Response> => {
        return fetch(addr, getHeaders(requestOptions))
        .catch((error: Error) => {
            console.log(error);
            throw error;
        })
    };
    
    const getHeaders = (requestOptions = {}): RequestInit => {
        const newRequestHeaders: RequestInit = requestOptions;
        // newRequestHeaders.credentials = 'include'; //Do not require CORS
        newRequestHeaders.headers = {
            // Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
        return newRequestHeaders;
    }

    return {
        httpRequest,
        cancellableHttpRequest
    }
}
export default useApiService