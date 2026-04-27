# Complete game generator
import json, os

BASE = "https://cdn.hailuoai.com/mcp/cdn_upload/500460485766438916/387751032226725/"

URLS = {k:BASE+v for k,v in {
  "ducky":"1777270267_f88166b4.png","wolfy":"1777270576_90c46335.png",
  "meimi":"1777270314_5d57634e.png","lingling":"1777270347_176e3f54.png",
  "fire":"1777270381_4269b373.png","bubble":"1777270443_cae2e633.png",
  "moonfox":"1777270475_eb6ad413.png","starcub":"1777270530_1d0b1466.png"}}

PET_INFO = {
  "ducky":{"name":"小黄鸭","emoji":"🐤","rarity":"⭐","lines":["嘎嘎嘎~今天的任务真棒！","元元最厉害了！小黄鸭给你比个心！","呜……好饿……能喂我吃点东西吗？","太开心啦！游来游去~"]},
  "wolfy":{"name":"小灰狼","emoji":"🐺","rarity":"⭐","lines":["……任务完成，还行。","继续保持，不错。","……肚子饿了。","你今天很努力。认可你。"]},
  "meimi":{"name":"棉花羊","emoji":"🐑","rarity":"⭐⭐","lines":["咩~今天也好困……","棉花糖一样软的毛毛~","睡睡觉就能拿第一名，真好~","嗯……让我再睡五分钟……"]},
  "lingling":{"name":"磷磷龟","emoji":"🐢","rarity":"⭐⭐","lines":["慢慢爬，总会到的~","背上的小花开得真好！","不着急，一点一点来~","加油，你也可以的！"]},
  "fire":{"name":"烈焰鸡","emoji":"🐔","rarity":"⭐⭐⭐","lines":["咯咯咯！我是最帅的！","早起的鸟儿有虫吃！","我是火焰中最耀眼的那只！","骄傲但是可爱！"]},
  "bubble":{"name":"泡泡龙","emoji":"🐉","rarity":"⭐⭐⭐","lines":["噗噜噗噜~泡泡里藏着愿望~","这个泡泡是给你的！🎈","许个愿吧，会实现的~","泡泡飘啊飘，烦恼都走开~"]},
  "moonfox":{"name":"月光狐","emoji":"🦊","rarity":"⭐⭐⭐⭐","lines":["月亮升起来了，该我出场了~","只对喜欢的人说秘密哦~","银色的尾巴，藏着极光~","深夜的森林，最适合说悄悄话~"]},
  "starcub":{"name":"星际熊","emoji":"🧸","rarity":"⭐⭐⭐⭐","lines":["我来自银河尽头哦~","星星们都在对我眨眼睛✨","宇宙很大，你是最特别的那个~","肚子上的星星，是我的能量源~"]}}

TASKS = {"yuan":[{"id":"yy1","name":"英语作业","icon":"📖","coin":15},{"id":"yy2","name":"英语小书跟读","icon":"🎤","coin":10},{"id":"yy3","name":"高斯数学","icon":"🔢","coin":15},{"id":"yy4","name":"钢琴练习","icon":"🎹","coin":20},{"id":"yy5","name":"跳绳200次","icon":"🪁","coin":20}],"xin":[{"id":"xb1","name":"校内语数英作业","icon":"📚","coin":15},{"id":"xb2","name":"英语作业","icon":"📖","coin":10},{"id":"xb3","name":"高斯数学","icon":"🔢","coin":15},{"id":"xb4","name":"预复习","icon":"📝","coin":10},{"id":"xb5","name":"钢琴练习1小时","icon":"🎹","coin":20},{"id":"xb6","name":"体育运动","icon":"🏃","coin":15}]}

SHOP = [{"id":"bread","name":"面包","icon":"🥖","price":10,"effect":30,"type":"food"},{"id":"fish","name":"小鱼干","icon":"🐟","price":20,"effect":50,"type":"food"},{"id":"carrot","name":"胡萝卜","icon":"🥕","price":12,"effect":35,"type":"food"},{"id":"bone","name":"骨头","icon":"🦴","price":15,"effect":40,"type":"food"},{"id":"ball","name":"皮球","icon":"⚽","price":25,"type":"toy"},{"id":"frisbee","name":"飞盘","icon":"🥏","price":30,"type":"toy"}]

GACHA = [{"type":"meimi","weight":30},{"type":"lingling","weight":30},{"type":"fire","weight":20},{"type":"bubble","weight":15},{"type":"moonfox","weight":4},{"type":"starcub","weight":1}]

HANZI = ["日","月","水","火","山","木","人","大","小","天","上","下","中","口","手","心","学","校","书","本","笔","家","爱","好","朋","红","花","草","树","风","雨","雪","春","夏","秋","冬","年","时","快","走","跑","跳","飞","鸟","鱼","狗","猫","白","黑","蓝","黄","绿","新","长","高","多","少","开","关","来","去","回","国","前","后","左","右","妈","爸","哥","弟","同","老","课","桌","椅","床","米","面","肉","菜","果","糖","车","路","河","海","光","电","话","字","名","队","歌","画","玩","游","读","写","看","想","做","要","能","把","对","错","睡","醒","每","明","昨","今","很","真","最","都","还","就","才","已","再","然","但","如","因","所","有","没","在","从","向","起","点","现","完","成","正"]

def j(o): return json.dumps(o, ensure_ascii=False)

# Build HTML
with open('/workspace/pet-game/mengchong.html','w') as f:
  f.write('<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"><title>萌宠任务岛</title></head><body><div id="app"></div><script>\n')
  f.write('var PET_URLS='+j(URLS)+';\n')
  f.write('var PET_INFO='+j(PET_INFO)+';\n')
  f.write('var TASKS='+j(TASKS)+';\n')
  f.write('var SHOP='+j(SHOP)+';\n')
  f.write('var GACHA_POOL='+j(GACHA)+';\n')
  f.write('var HANZI='+j(HANZI)+';\n')
  f.write('var EBBINGHAUS=[1,2,4,7,15,30];\n')
  
  # Read and append game code
  with open('/workspace/pet-game/game_code.js','r',encoding='utf-8') as gf:
    f.write(gf.read())
  
  f.write('\n</script></body></html>')

print('Done! Size:', os.path.getsize('/workspace/pet-game/mengchong.html'), 'bytes')
