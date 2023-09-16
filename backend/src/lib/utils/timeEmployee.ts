export default function timeEmployee(
  st: Date,
  et: Date,
  sta: number = 0,
  eta: number = 0
) {
  const now = new Date();

  const startTime = new Date();
  startTime.setHours(st.getHours() + sta, st.getMinutes());

  const endTime = new Date();
  endTime.setHours(et.getHours() + eta, et.getMinutes());

  if (
    now.getTime() < startTime.getTime() ||
    now.getTime() > endTime.getTime()
  ) {
    return false;
  }

  return true;
}
