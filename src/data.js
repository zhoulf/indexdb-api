import { getStore } from './store'

/**
 * getAllData
 * @param {*} dbName
 * @param {*} storeName
 */
async function getAllData(dbName, storeName) {
  const store = await getStore(dbName, storeName)

  return new Promise((resolve, reject) => {
    const dataArr = []

    const req = store.openCursor()

    req.onsuccess = event => {
      const cursor = event.target.result

      if (cursor) {
        dataArr.push(cursor.value)
        cursor.continue()
      } else {
        resolve(dataArr)
      }
    }

    req.onerror = reject
  })
}

/**
 * getDataByIndex
 * @param {*} dbName
 * @param {*} storeName
 * @param {*} indexName
 * @param {*} value
 */
async function getDataByIndex(dbName, storeName, indexName, value) {
  const store = await getStore(dbName, storeName)

  return new Promise((resolve, reject) => {
    const index = store.index(indexName)

    const req = index.get(value)

    req.onsuccess = event => {
      resolve(event.target.result)
    }

    req.onerror = reject
  })
}

/**
 * getRangeDataByPrimaryKey
 */
async function getRangeDataByPrimaryKey(dbName, storeName, start, end) {
  const store = await getStore(dbName, storeName)

  return new Promise((resolve, reject) => {
    const range = IDBKeyRange.bound(start, end)

    const dataArr = []

    const req = store.openCursor(range)

    req.onsuccess = event => {
      const cursor = event.target.result

      if (cursor) {
        dataArr.push(cursor.value)
        cursor.continue()
      } else {
        resolve(dataArr)
      }
    }

    req.onerror = reject
  })
}

/**
 * addOneData
 */
async function addOneData(dbName, storeName, data) {
  const store = await getStore(dbName, storeName)

  return new Promise((resolve, reject) => {
    const req = store.add(data)

    req.onsuccess = event => {
      // event.target.result is the count of the data
      resolve(event.target.result)
    }
    req.onerror = reject
  })
}

/**
 * putOneData
 * update a data accoring to the primary key
 * you can use putOneData to add a data, when the primary is the same, then putOneData will update the old data
 */
async function putOneData(dbName, storeName, data) {
  const store = await getStore(dbName, storeName)

  return new Promise((resolve, reject) => {
    const req = store.put(data)

    req.onsuccess = event => {
      resolve(event.target.result)
    }

    req.onerror = reject
  })
}

/**
 * deleteDataByPrimaKey
 */
async function deleteDataByPrimaKey(dbName, storeName, primaryKeyValue) {
  const store = await getStore(dbName, storeName)

  if (store) {
    store.delete(primaryKeyValue)

    return true
  }
}

export {
  getAllData,
  getDataByIndex,
  getRangeDataByPrimaryKey,
  addOneData,
  putOneData,
  deleteDataByPrimaKey
}
