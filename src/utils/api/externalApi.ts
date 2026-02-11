import axios from "axios";
import { backend } from "../../configs";

export const api = axios.create({ baseURL: backend.api });
