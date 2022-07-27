import {
  take,
  put,
  delay,
  call,
  fork,
  takeEvery,
  cancelled,
  cancel,
  takeLatest,
} from "redux-saga/effects";

function double(number) {
  return number * 2;
}

export function* testSaga() {
  while (true) {
    console.log("Starting Saga...");
    const state = yield take("TEST_MESSAGE");
    const a = yield call(double, 2);
    console.log("a", a);
    const b = yield double(3);
    console.log("b", b);
    console.log("Finishing saga function", state);
  }
}

function* doNothing() {
  console.log("I have been called");
  yield delay(1000);
  console.log("Doin nothing");
}

export function* testSagaFork() {
  while (true) {
    yield take("TEST_MESSAGE_2");
    yield delay(1000);
    yield fork(doNothing);
    yield fork(doNothing);
    yield fork(doNothing);
  }
}

export function* testSagaTakeEveryProcess({ payload }) {
  console.log(`Starting Process for index ${payload}`);
  yield delay(3000);
  console.log(`Ending Process for index ${payload}`);
}

export function* testSagaTakeEvery() {
  const { payload } = yield takeEvery(
    "TEST_MESSAGE_3",
    testSagaTakeEveryProcess
  );
  console.log(`Finish TakeEvery for index ${payload}`);
}

export function* infinitySaga() {
  let index = 0;
  console.log(`Starting infinity saga`);
  while (true) {
    index++;
    try {
      console.log(`inside infinity loop ${index}`);
      yield delay(1000);
    } catch (error) {
      console.error("A error happend:", error);
    } finally {
      console.log("The fork was cancelled?", yield cancelled());
    }
  }
  // eslint-disable-next-line no-unreachable
  console.log("Ending Infinity saga");
}

export function* testSagaCancelled() {
  yield take("TEST_MESSAGE_4");
  const handleCancel = yield fork(infinitySaga);
  yield delay(3000);
  yield cancel(handleCancel);
}

export function* testSagaTakeLatest() {
  yield takeLatest("TEST_MESSAGE_5", infinitySaga);
}

export function* dispatchTest() {
  let index = 0;
  // yield put({ type: "TEST_MESSAGE_4", payload: index });
  while (true) {
    yield delay(5000);
    yield put({ type: "TEST_MESSAGE_5", payload: index });
    index++;
  }
}
