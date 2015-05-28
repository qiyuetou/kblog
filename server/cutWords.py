import pymongo
import re
import jieba.analyse
import jieba
import math
import os
from bson.objectid import ObjectId
path =  os.path.dirname(os.path.abspath(__file__))
client = pymongo.MongoClient('mongodb://localhost:27017');


db = client.zhuwenlong

db.authenticate('zhuwenlong','123123')

collection = db.blog

oneDate=collection.find();

fileNum=1;
wordsMap={}
fileWords={}
cleanWords={}
titles={}
for i in oneDate:
    content=i['content']
    blogId=i['_id']
    titles[str(blogId)]=str(i['title'])
    
    cleanWord=re.sub(r"[^a-zA-Z\u4e00-\u9fa5]",' ',content)
    cleanWord=re.sub(r"\s[a-zA-Z]{1,3}\s",' ',cleanWord)
    cleanWord=re.sub(r"\s([a-zA-Z\u4e00-\u9fa5])(\1)+\s",' ',cleanWord)
    cleanWord=re.sub(r"\s+",' ',cleanWord)

    cleanWords[blogId]=cleanWord

    fileWords[blogId]={}
    words=jieba.cut(cleanWord,cut_all=False);

    for j in words:
        wordsMap[j]=0;
        if j in fileWords[blogId]:
            times=fileWords[blogId][j]
            fileWords[blogId][j]=times+1
        else:
            fileWords[blogId][j]=0
    fileNum=fileNum+1

file = open(path+'/idf.txt.big','w');
for i in wordsMap:
    iTime=0
    for files in fileWords:
        if i in fileWords[files]:
            iTime+=1
    if i != ' ':
        file.write(str(i)+' '+str(math.log(fileNum/iTime,2))+'\n')
file.close()

fileWords={}
for i in cleanWords:
    jieba.analyse.set_stop_words(path+'/stopwords')
    jieba.analyse.set_idf_path(path+'/idf.txt.big')
    words = jieba.analyse.extract_tags(cleanWords[i], topK=20)
    fileWords[str(i)]=words


index=0;
current=0;
similar={}
for i in fileWords:
    similar[i]={}
    current=0;
    for j in fileWords:
        if i == j:
            continue
        uLen=len(fileWords[i]);
        nLen=0;
        for k in fileWords[j]:
            if(k in fileWords[i]):
                nLen+=1;
            else:
                uLen+=1;
        present = nLen/uLen;
        if present>0:
            similar[i][j]={"present":present,"title":titles[j]}
    index+=1
    similar[i]=sorted(similar[i].items(),key=lambda x: -x[1]["present"])

    collection.find_one_and_update({"_id":ObjectId(i)},{'$set':{'links':similar[i]}})

    articleList=[];

#print(similar,'\n\n\n\n')
print('success');
