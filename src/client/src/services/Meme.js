import API from '#/API';
import Utils from '@utils';

export default {
  random2 () {
    return API.access().get('/api/v1/meme/random2');
  },
  vote(data){
    return API.access().post(`/api/v1/meme/vote`,data);
  },
  load(query){
    return API.noAuth().get(`/api/v1/meme${Utils.query(query)}`)
  },
  loadOne(id){
    return API.noAuth().get(`/api/v1/meme/${id}`)
  },
  deleteById(id){
    return API.access().delete(`/api/v1/meme/${id}`)
  }
}
