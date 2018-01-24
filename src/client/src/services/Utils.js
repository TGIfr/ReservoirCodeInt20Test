import $store from '@store';


function notEmpty (v) {
  if (Array.isArray(v)) {
    return v.length > 0;
  } else {
    return true;
  }
}

function convertToURL (v) {
  if (typeof v == 'object' || Array.isArray(v)) {
    return JSON.stringify(v);
  } else {
    return v;
  }
}

export default {
  /**
   * pass filter args to URL-decoded string
   * @param filter object with args
   * @return {string} URL
   */
  query (filter) {
    let query = '?';
    for (let key in filter) {
      if (filter[key] && notEmpty(filter[key]))
        query += `${key}=${convertToURL(filter[key])}&`;
    }
    return query;
  },
}
