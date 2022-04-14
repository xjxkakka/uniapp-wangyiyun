const baseUrl = 'http://localhost:3000';
// 文档地址 https://neteasecloudmusicapi.vercel.app/#/
// 有的请求需要携带cookie才能获取到 所以这里直接定义cookie，用户登录后会返回cookie
const cookie = "__remember_me=true; Max-Age=1296000; Expires=Wed, 27 Apr 2022 05:38:28 GMT; Path=/;;MUSIC_A_T=1649741355311; Max-Age=2147483647; Expires=Sun, 30 Apr 2090 08:52:35 GMT; Path=/weapi/feedback;;MUSIC_R_T=1649741355433; Max-Age=2147483647; Expires=Sun, 30 Apr 2090 08:52:35 GMT; Path=/wapi/clientlog;;MUSIC_R_T=1649741355433; Max-Age=2147483647; Expires=Sun, 30 Apr 2090 08:52:35 GMT; Path=/eapi/clientlog;;MUSIC_A_T=1649741355311; Max-Age=2147483647; Expires=Sun, 30 Apr 2090 08:52:35 GMT; Path=/wapi/feedback;;MUSIC_R_T=1649741355433; Max-Age=2147483647; Expires=Sun, 30 Apr 2090 08:52:35 GMT; Path=/weapi/clientlog;;MUSIC_SNS=; Max-Age=0; Expires=Tue, 12 Apr 2022 05:38:28 GMT; Path=/;MUSIC_A_T=1649741355311; Max-Age=2147483647; Expires=Sun, 30 Apr 2090 08:52:35 GMT; Path=/weapi/clientlog;;MUSIC_R_T=1649741355433; Max-Age=2147483647; Expires=Sun, 30 Apr 2090 08:52:35 GMT; Path=/eapi/feedback;;MUSIC_A_T=1649741355311; Max-Age=2147483647; Expires=Sun, 30 Apr 2090 08:52:35 GMT; Path=/api/feedback;;MUSIC_R_T=1649741355433; Max-Age=2147483647; Expires=Sun, 30 Apr 2090 08:52:35 GMT; Path=/weapi/feedback;;MUSIC_A_T=1649741355311; Max-Age=2147483647; Expires=Sun, 30 Apr 2090 08:52:35 GMT; Path=/eapi/feedback;;MUSIC_R_T=1649741355433; Max-Age=2147483647; Expires=Sun, 30 Apr 2090 08:52:35 GMT; Path=/api/feedback;;MUSIC_R_T=1649741355433; Max-Age=2147483647; Expires=Sun, 30 Apr 2090 08:52:35 GMT; Path=/api/clientlog;;MUSIC_U=e95ee7318bac53461d414d9865bdf8356ef847e87cba557c7ec8537c85a73d21993166e004087dd3fba5629a648ba2b3b2ee2674351303cb46b14e3f0c3f8af9fe5c85647582a507; Max-Age=1296000; Expires=Wed, 27 Apr 2022 05:38:28 GMT; Path=/;;MUSIC_A_T=1649741355311; Max-Age=2147483647; Expires=Sun, 30 Apr 2090 08:52:35 GMT; Path=/neapi/feedback;;MUSIC_R_T=1649741355433; Max-Age=2147483647; Expires=Sun, 30 Apr 2090 08:52:35 GMT; Path=/openapi/clientlog;;__csrf=692d5d40ddcb4e4506be1686f3edce38; Max-Age=1296010; Expires=Wed, 27 Apr 2022 05:38:38 GMT; Path=/;;MUSIC_A_T=1649741355311; Max-Age=2147483647; Expires=Sun, 30 Apr 2090 08:52:35 GMT; Path=/wapi/clientlog;;MUSIC_A_T=1649741355311; Max-Age=2147483647; Expires=Sun, 30 Apr 2090 08:52:35 GMT; Path=/neapi/clientlog;;MUSIC_R_T=1649741355433; Max-Age=2147483647; Expires=Sun, 30 Apr 2090 08:52:35 GMT; Path=/wapi/feedback;;MUSIC_R_T=1649741355433; Max-Age=2147483647; Expires=Sun, 30 Apr 2090 08:52:35 GMT; Path=/neapi/clientlog;;MUSIC_R_T=1649741355433; Max-Age=2147483647; Expires=Sun, 30 Apr 2090 08:52:35 GMT; Path=/neapi/feedback;;MUSIC_A_T=1649741355311; Max-Age=2147483647; Expires=Sun, 30 Apr 2090 08:52:35 GMT; Path=/eapi/clientlog;;MUSIC_A_T=1649741355311; Max-Age=2147483647; Expires=Sun, 30 Apr 2090 08:52:35 GMT; Path=/api/clientlog;;MUSIC_A_T=1649741355311; Max-Age=2147483647; Expires=Sun, 30 Apr 2090 08:52:35 GMT; Path=/openapi/clientlog;"

function $http(url, method = 'get', data = {}) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseUrl + url,
			method,
			data,
			success: res => {
				resolve(res.data)
			},
			fail: (error) => {
				reject(error)
			},
			complete: () => {}
		});
	})
}

export function topList(url){
	return $http(url);
}

export function rankingList(id){
	return $http(`/playlist/detail?id=${id}&cookie=${cookie}`,'get')
}

// 歌曲详情
export function songDetail(id){
	return $http(`/song/detail?ids=${id}&cookie=${cookie}`,'get')
}

// 相似歌曲
export function songSimi(songId){
	return $http(`/simi/song?id=${songId}&cookie=${cookie}`,'get')
}

// 歌曲评论
export function songComment(songId){
	return $http(`/comment/music?id=${songId}&cookie=${cookie}`,'get')
}

// 歌词
export function songLyric(songId){
	return $http(`/lyric?id=${songId}&cookie=${cookie}`,'get')
}

// 歌曲所有信息 音频
export function songUrl(songId){
	return $http(`/song/url?id=${songId}&cookie=${cookie}`,'get')
}

// 搜索热歌
export function searchHot(){
	return $http(`/search/hot/detail`,'get')
}
// 搜索歌曲
export function searchWord(word){
	return $http(`/search?keywords=${word}`,'get')
}

// 搜索建议
export function searchSuggest(word){
	return $http(`/search/suggest?keywords=${word}&type=mobile`,'get')
}
