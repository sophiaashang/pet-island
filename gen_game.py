#!/usr/bin/env python3
# Generate the complete game HTML
import json, sys

PET_URLS_BASE = "https://cdn.hailuoai.com/mcp/cdn_upload/500460485766438916/387751032226725/"

def write(f, s):
    f.write(s + "\n")

with open('/workspace/pet-game/mengchong.html', 'w', encoding='utf-8') as f:
    write(f, '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"><title>萌宠任务岛</title></head><body><div id="app"></div><script>')
    
    # PET URLs
    urls = {k: PET_URLS_BASE + v for k, v in {
        "ducky":"1777270267_f88166b4.png",
        "wolfy":"1777270576_90c46335.png",
        "meimi":"1777270314_5d57634e.png",
        "lingling":"1777270347_176e3f54.png",
        "fire":"1777270381_4269b373.png",
        "bubble":"1777270443_cae2e633.png",
        "moonfox":"1777270475_eb6ad413.png",
        "starcub":"1777270530_1d0b1466.png",
    }.items()}
    write(f, f'const PET_URLS={json.dumps(urls)};')
    
    # PET INFO
    pet_info = {
        "ducky":{"name":"小黄鸭","emoji":"🐤","rarity":"⭐","lines":["嘎嘎嘎~今天的任务真棒！","元元最厉害了！小黄鸭给你比个心！","呜……好饿……能喂我吃点东西吗？","太开心啦！游来游去~"]},
        "wolfy":{"name":"小灰狼","emoji":"🐺","rarity":"⭐","lines":["……任务完成，还行。","继续保持，不错。","……肚子饿了。","你今天很努力。认可你。"]},
        "meimi":{"name":"棉花羊","emoji":"🐑","rarity":"⭐⭐","lines":["咩~今天也好困……","棉花糖一样软的毛毛~","睡睡觉就能拿第一名，真好~","嗯……让我再睡五分钟……"]},
        "lingling":{"name":"磷磷龟","emoji":"🐢","rarity":"⭐⭐","lines":["慢慢爬，总会到的~","背上的小花开得真好！","不着急，一点一点来~","加油，你也可以的！"]},
        "fire":{"name":"烈焰鸡","emoji":"🐔","rarity":"⭐⭐⭐","lines":["咯咯咯！我是最帅的！","早起的鸟儿有虫吃！","我是火焰中最耀眼的那只！","骄傲但是可爱！"]},
        "bubble":{"name":"泡泡龙","emoji":"🐉","rarity":"⭐⭐⭐","lines":["噗噜噗噜~泡泡里藏着愿望~","这个泡泡是给你的！🎈","许个愿吧，会实现的~","泡泡飘啊飘，烦恼都走开~"]},
        "moonfox":{"name":"月光狐","emoji":"🦊","rarity":"⭐⭐⭐⭐","lines":["月亮升起来了，该我出场了~","只对喜欢的人说秘密哦~","银色的尾巴，藏着极光~","深夜的森林，最适合说悄悄话~"]},
        "starcub":{"name":"星际熊","emoji":"🧸","rarity":"⭐⭐⭐⭐","lines":["我来自银河尽头哦~","星星们都在对我眨眼睛✨","宇宙很大，你是最特别的那个~","肚子上的星星，是我的能量源~"]},
    }
    write(f, f'const PET_INFO={json.dumps(pet_info,ensure_ascii=False)};')
    
    # TASKS
    tasks_y = [{"id":"yy1","name":"英语作业","icon":"📖","coin":15},{"id":"yy2","name":"英语小书跟读","icon":"🎤","coin":10},{"id":"yy3","name":"高斯数学","icon":"🔢","coin":15},{"id":"yy4","name":"钢琴练习","icon":"🎹","coin":20},{"id":"yy5","name":"跳绳200次","icon":"🪁","coin":20}]
    tasks_x = [{"id":"xb1","name":"校内语数英作业","icon":"📚","coin":15},{"id":"xb2","name":"英语作业","icon":"📖","coin":10},{"id":"xb3","name":"高斯数学","icon":"🔢","coin":15},{"id":"xb4","name":"预复习","icon":"📝","coin":10},{"id":"xb5","name":"钢琴练习1小时","icon":"🎹","coin":20},{"id":"xb6","name":"体育运动","icon":"🏃","coin":15}]
    write(f, f'const TASKS={{yuanyuan:{json.dumps(tasks_y,ensure_ascii=False)},xinbei:{json.dumps(tasks_x,ensure_ascii=False)}}};')
    
    # SHOP
    shop = [{"id":"bread","name":"面包","icon":"🥖","price":10,"effect":30,"type":"food"},{"id":"fish","name":"小鱼干","icon":"🐟","price":20,"effect":50,"type":"food"},{"id":"carrot","name":"胡萝卜","icon":"🥕","price":12,"effect":35,"type":"food"},{"id":"bone","name":"骨头","icon":"🦴","price":15,"effect":40,"type":"food"},{"id":"ball","name":"皮球","icon":"⚽","price":25,"type":"toy"},{"id":"frisbee","name":"飞盘","icon":"🥏","price":30,"type":"toy"}]
    write(f, f'const SHOP={json.dumps(shop,ensure_ascii=False)};')
    
    # GACHA
    gacha = [{"type":"meimi","weight":30},{"type":"lingling","weight":30},{"type":"fire","weight":20},{"type":"bubble","weight":15},{"type":"moonfox","weight":4},{"type":"starcub","weight":1}]
    write(f, f'const GACHA_POOL={json.dumps(gacha,ensure_ascii=False)};')
    write(f, 'const EBBINGHAUS=[1,2,4,7,15,30];')
    
    # Now write the game JS - use a separate file approach
    write(f, '// ===== GAME CODE =====')
    write(f, open('/workspace/pet-game/game_code_part1.js','r',encoding='utf-8').read())

print("Part 1 done")
