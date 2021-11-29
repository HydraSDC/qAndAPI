import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  http.get('http://localhost:3333/qa/answers?question_id=4321');
  sleep(1);
}