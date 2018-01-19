module.exports = function backpackTimer (backpack, opts) {
  backpack.timer = backpack.timer || {}
  if (!backpack.timer.startTime) {
    backpack.timer.startTime = Date.now()
    return
  }
  backpack.timer.endTime = Date.now()
  backpack.timer.timeSpent = (backpack.timer.endTime - backpack.timer.startTime) / 1000
  backpack.log(`Backpack was packed in ${backpack.timer.timeSpent} seconds! ⏰ ⚡️`)
}
