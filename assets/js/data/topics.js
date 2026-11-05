/* Bộ đề IELTS Speaking — sửa / bổ sung topic tại đây. */
(function(global){
 "use strict";
  var TOPICS = [
    { name:"Nơi ở & Quê hương",
      part1:["Do you live in a house or an apartment?","What do you like most about your hometown?","Has your hometown changed much since you were a child?","Would you like to live somewhere else in the future?"],
      part2:{title:"Describe a place in your hometown that you enjoy visiting.", bullets:["where it is","how often you go there","what you do there","and explain why you enjoy visiting this place"]},
      part3:["Why do people move away from small towns to big cities?","What are the advantages and disadvantages of living in a big city?","How might towns and cities change in the future?","Should governments invest more in rural areas or urban areas?"]
    },
    { name:"Công việc & Học tập",
      part1:["Do you work or are you a student?","What do you like about your job or your studies?","What was your first day like?","What skills are important in your field?"],
      part2:{title:"Describe a job you would like to have in the future.", bullets:["what the job is","what qualifications you would need","what the job involves","and explain why you would like to have this job"]},
      part3:["How has the nature of work changed in recent years?","Do you think job satisfaction is more important than salary?","What impact does technology have on the way people work?","Should people change careers several times in their life?"]
    },
    { name:"Sở thích & Thời gian rảnh",
      part1:["What do you usually do in your free time?","Have your hobbies changed since you were a child?","Do you prefer indoor or outdoor activities?","How important is it for people to have hobbies?"],
      part2:{title:"Describe a hobby or activity you enjoy doing.", bullets:["what it is","how you got interested in it","how often you do it","and explain why you enjoy it"]},
      part3:["Why do you think people's hobbies change as they get older?","Do you think hobbies are more important now than in the past?","Should schools encourage students to have hobbies?","How do hobbies benefit mental health?"]
    },
    { name:"Ẩm thực",
      part1:["What is your favourite food?","Do you enjoy cooking?","What kind of restaurants do you like?","Has your diet changed over the years?"],
      part2:{title:"Describe a meal you really enjoyed.", bullets:["what the meal was","where you had it","who you were with","and explain why you enjoyed it"]},
      part3:["How have eating habits changed in your country?","What are the effects of fast food on health?","Do you think traditional cooking skills are disappearing?","Should governments regulate unhealthy food advertising?"]
    },
    { name:"Công nghệ",
      part1:["What kind of technology do you use every day?","Do you find it easy to learn new technology?","Was technology very different when you were a child?","What device could you not live without?"],
      part2:{title:"Describe a piece of technology you find useful.", bullets:["what it is","how you use it","how long you have used it","and explain why you find it useful"]},
      part3:["How has technology changed the way people communicate?","What are the disadvantages of relying too much on technology?","Do you think technology will replace human jobs in the future?","How can people protect their privacy in the digital age?"]
    },

    {"name": "Gia đình & Bạn bè", "part1": ["How often do you spend time with your family?", "Who do you usually ask for advice?", "Do you prefer meeting friends in person or online?", "What makes a good friendship?"], "part2": {"title": "Describe a friend who has helped you.", "bullets": ["who this person is", "how you met", "what they did to help you", "and explain why their help mattered"]}, "part3": ["How have family relationships changed in recent years?", "Why is friendship important at different ages?", "Can people maintain close friendships online?", "Should schools teach social skills?"]},
    {"name": "Du lịch & Kỳ nghỉ", "part1": ["Do you enjoy travelling?", "Where did you go on your last holiday?", "Do you prefer travelling alone or with others?", "What kind of places would you like to visit?"], "part2": {"title": "Describe a memorable trip you took.", "bullets": ["where you went", "who you went with", "what you did", "and explain why the trip was memorable"]}, "part3": ["How does tourism benefit local communities?", "What problems can too many tourists cause?", "How might travel change in the future?", "Should governments promote domestic tourism?"]},
    {"name": "Âm nhạc", "part1": ["What kind of music do you listen to?", "When do you usually listen to music?", "Did you learn a musical instrument as a child?", "Do you prefer live music or recordings?"], "part2": {"title": "Describe a song or piece of music you remember well.", "bullets": ["what it is", "when you first heard it", "how it makes you feel", "and explain why you remember it"]}, "part3": ["Why is music important in different cultures?", "How has technology changed the music industry?", "Should children learn to play an instrument?", "What makes live performances appealing?"]},
    {"name": "Phim ảnh & Truyền hình", "part1": ["What kinds of films do you enjoy?", "Do you prefer watching films at home or in a cinema?", "Who do you usually watch films with?", "Have your viewing habits changed recently?"], "part2": {"title": "Describe a film that made you think.", "bullets": ["what the film is", "what happens in it", "when you watched it", "and explain why it made you think"]}, "part3": ["Can films influence people’s behaviour?", "Should films reflect real social issues?", "How have streaming services changed entertainment?", "What is the value of local film industries?"]},
    {"name": "Sách & Đọc sách", "part1": ["Do you enjoy reading?", "What kinds of books do you prefer?", "Did someone read to you when you were younger?", "Do you prefer printed books or e-books?"], "part2": {"title": "Describe a book you would recommend.", "bullets": ["what the book is about", "how you found it", "what you learned from it", "and explain why you recommend it"]}, "part3": ["How can schools encourage reading?", "Will digital media replace printed books?", "Why do people read different genres?", "How does reading affect imagination?"]},
    {"name": "Thể thao & Vận động", "part1": ["Do you enjoy playing sports?", "What sport is popular where you live?", "Did you play sports at school?", "Do you prefer team or individual activities?"], "part2": {"title": "Describe a sport you would like to try.", "bullets": ["what it is", "where you could try it", "who you would do it with", "and explain why it interests you"]}, "part3": ["Why do communities invest in sports facilities?", "What are the benefits of team sports?", "Should schools focus more on physical education?", "How has technology influenced professional sports?"]},
    {"name": "Thiên nhiên & Môi trường", "part1": ["Do you like spending time outdoors?", "Is there a park near your home?", "What environmental issues concern people in your area?", "Do you try to reduce waste?"], "part2": {"title": "Describe a natural place you would like to visit.", "bullets": ["where it is", "what it looks like", "what you would do there", "and explain why you want to visit it"]}, "part3": ["How can cities protect green spaces?", "What can individuals do to reduce pollution?", "Should businesses be responsible for environmental impacts?", "How can people learn about biodiversity?"]},
    {"name": "Giáo dục & Trường học", "part1": ["What was your favourite subject at school?", "How do you prefer to study?", "Do you enjoy learning with classmates?", "What would you like to learn next?"], "part2": {"title": "Describe a teacher who helped you learn something.", "bullets": ["who the teacher was", "what they taught", "how they supported you", "and explain what you learned"]}, "part3": ["How should schools prepare students for the future?", "What are the benefits of online learning?", "Are exams the best way to assess knowledge?", "How can education become more accessible?"]},
    {"name": "Lễ hội & Truyền thống", "part1": ["What festivals do you celebrate?", "Do you enjoy traditional celebrations?", "What do you usually do on special occasions?", "Have local traditions changed over time?"], "part2": {"title": "Describe a celebration you enjoyed.", "bullets": ["what the occasion was", "where it took place", "who attended", "and explain why it was special"]}, "part3": ["Why is it important to preserve traditions?", "How does tourism influence cultural festivals?", "Are young people interested in traditional customs?", "How can celebrations bring communities together?"]},
    {"name": "Mua sắm & Tiêu dùng", "part1": ["Do you enjoy shopping?", "Do you usually shop online or in stores?", "What did you buy recently?", "Do you compare prices before purchasing things?"], "part2": {"title": "Describe something useful that you bought.", "bullets": ["what it was", "where you bought it", "how you use it", "and explain why it was worth buying"]}, "part3": ["How has online shopping affected local stores?", "Why do people buy things they do not need?", "Should advertising aimed at children be limited?", "How can people shop more sustainably?"]},
    {"name": "Giao thông & Đi lại", "part1": ["How do you usually travel around your city?", "Do you use public transport?", "What is the busiest road near you?", "Would you like to cycle more often?"], "part2": {"title": "Describe a journey you take regularly.", "bullets": ["where you travel", "how you get there", "how long it takes", "and explain what you like or dislike about it"]}, "part3": ["How can public transport be improved?", "Why do cities experience traffic congestion?", "What are the pros and cons of electric vehicles?", "Should cities create more space for pedestrians?"]},
    {"name": "Sức khỏe & Thói quen tốt", "part1": ["What do you do to stay healthy?", "Do you get enough sleep?", "What helps you relax after a busy day?", "Have your daily habits changed recently?"], "part2": {"title": "Describe a healthy habit you have developed.", "bullets": ["what the habit is", "when you started it", "how you maintain it", "and explain how it helps you"]}, "part3": ["How can governments encourage healthier lifestyles?", "Why is maintaining healthy habits difficult?", "What role do schools play in health education?", "How does modern work affect well-being?"]},
    {"name": "Internet & Mạng xã hội", "part1": ["How often do you use social media?", "What do you like to do online?", "Do you follow educational accounts?", "Would you like to spend less time on your phone?"], "part2": {"title": "Describe a website or app you find helpful.", "bullets": ["what it is", "how you discovered it", "how often you use it", "and explain why it is helpful"]}, "part3": ["How has social media changed communication?", "How can people assess information online?", "Should schools teach digital literacy?", "How can users better protect their privacy?"]},
    {"name": "Thời tiết & Mùa", "part1": ["What is the weather like in your hometown?", "Which season do you prefer?", "Does the weather affect your plans?", "Have you experienced unusual weather recently?"], "part2": {"title": "Describe a day when the weather changed your plans.", "bullets": ["when it happened", "what the weather was like", "what you planned to do", "and explain what you did instead"]}, "part3": ["How does climate affect daily life?", "Why are weather forecasts important?", "How should cities prepare for extreme weather?", "What can communities do to adapt to climate change?"]},
    {"name": "Động vật & Thú cưng", "part1": ["Do you like animals?", "Have you ever had a pet?", "What animals are common where you live?", "Would you like to visit a wildlife reserve?"], "part2": {"title": "Describe an animal you find interesting.", "bullets": ["what animal it is", "where it lives", "what it is like", "and explain why you find it interesting"]}, "part3": ["Why should endangered species be protected?", "What responsibilities come with owning a pet?", "How can children learn to respect animals?", "Should cities provide more animal-friendly spaces?"]},
    {"name": "Trang phục & Phong cách", "part1": ["What clothes do you usually wear?", "Do you choose clothes for comfort or style?", "Have your clothing preferences changed?", "Do you like traditional clothes?"], "part2": {"title": "Describe an item of clothing you wear on special occasions.", "bullets": ["what it looks like", "where you got it", "when you wear it", "and explain why you like it"]}, "part3": ["How does fashion reflect cultural identity?", "What are the environmental impacts of fast fashion?", "Why do fashion trends change quickly?", "Should workplaces have dress codes?"]},
    {"name": "Nghệ thuật & Bảo tàng", "part1": ["Do you enjoy visiting museums?", "Did you study art at school?", "What kinds of art do you like?", "Are there public artworks in your city?"], "part2": {"title": "Describe an artwork that impressed you.", "bullets": ["what it was", "where you saw it", "what it looked like", "and explain why it impressed you"]}, "part3": ["Why should governments support museums?", "How can public art improve cities?", "What is the role of art education?", "How do digital technologies change the way people experience art?"]},
    {"name": "Hoạt động tình nguyện", "part1": ["Have you ever helped at a community event?", "Do people volunteer in your area?", "What causes are important to you?", "Would you like to volunteer in the future?"], "part2": {"title": "Describe a time you helped someone.", "bullets": ["who the person was", "what they needed", "what you did", "and explain how you felt afterwards"]}, "part3": ["Why do people choose to volunteer?", "Should schools encourage community service?", "How do charities build public trust?", "What can local governments do to support volunteers?"]},
    {"name": "Học ngoại ngữ", "part1": ["What languages would you like to learn?", "How do you practise English speaking?", "Do you find pronunciation challenging?", "Have you ever used language-learning apps?"], "part2": {"title": "Describe a useful language-learning experience.", "bullets": ["what you were learning", "where it happened", "what helped you improve", "and explain why it was useful"]}, "part3": ["Why is learning a second language valuable?", "Should children start learning languages early?", "Can technology replace language teachers?", "How can people maintain motivation when learning?"]},
    {"name": "Không gian công cộng", "part1": ["Is there a public library near you?", "Where do people in your area like to meet?", "Do you spend time in public parks?", "What public place could be improved?"], "part2": {"title": "Describe a public place that people enjoy visiting.", "bullets": ["where it is", "what people do there", "when it is busy", "and explain why it matters to the community"]}, "part3": ["What makes a city comfortable to live in?", "Why are free public spaces important?", "Should cities invest more in libraries?", "How can public places become more accessible?"]},
    {"name": "Đồ vật kỷ niệm", "part1": ["Do you keep old photographs?", "Is there something you have owned for a long time?", "Do you prefer practical or sentimental gifts?", "What things remind you of childhood?"], "part2": {"title": "Describe an object that is important to you.", "bullets": ["what it is", "how you got it", "where you keep it", "and explain why it is meaningful"]}, "part3": ["Why do people keep sentimental objects?", "How have digital photos changed the way we remember events?", "Should museums preserve ordinary household items?", "Can experiences be more valuable than possessions?"]},
    {"name": "Kỹ năng & Sáng tạo", "part1": ["What skill would you like to improve?", "Do you enjoy making things?", "How do you learn practical skills?", "Have you tried a creative hobby?"], "part2": {"title": "Describe a skill you learned recently.", "bullets": ["what the skill is", "how you learned it", "what was difficult", "and explain how you use it"]}, "part3": ["Why are practical skills important in education?", "How can people stay creative at work?", "Is it easier to learn new skills as a child?", "How can communities support lifelong learning?"]},
    {"name": "Nhà cửa & Trang trí", "part1": ["What is your favourite room at home?", "Do you like decorating your room?", "Do you prefer modern or traditional furniture?", "Would you like to change anything about your home?"], "part2": {"title": "Describe a room where you feel comfortable.", "bullets": ["where the room is", "what is in it", "what you do there", "and explain why you like spending time there"]}, "part3": ["How do housing needs change with age?", "Why do people care about interior design?", "How can homes become more environmentally friendly?", "Should cities encourage smaller living spaces?"]},
    {"name": "Kỷ niệm tuổi thơ", "part1": ["What games did you enjoy as a child?", "Did you spend much time outside when you were younger?", "What is your earliest school memory?", "Do you still visit places from your childhood?"], "part2": {"title": "Describe a happy memory from your childhood.", "bullets": ["when it happened", "who was involved", "what you did", "and explain why you remember it"]}, "part3": ["How have childhood experiences changed over time?", "Why is play important for children?", "How can families create meaningful memories?", "Do modern children have enough free time?"]},
    {"name": "Kế hoạch & Mục tiêu", "part1": ["Do you like making plans?", "What would you like to achieve this year?", "Do you use a calendar?", "Do your plans often change?"], "part2": {"title": "Describe a goal you worked hard to achieve.", "bullets": ["what the goal was", "why you chose it", "what steps you took", "and explain how you felt about the result"]}, "part3": ["Why is goal-setting useful?", "Should young people plan their careers early?", "How do people deal with unexpected changes?", "Is success more about effort or opportunity?"]}
  ];
  var TOPIC_SUPPORT = {
    'Nơi ở & Quê hương': {
      words:['residential area','green spaces','public transport','sense of community','within walking distance','peaceful neighbourhood'],
      ideas:[
        'Nêu rõ bạn đang sống ở đâu và loại khu vực đó như thế nào: yên tĩnh, đông đúc, hiện đại hay truyền thống.',
        'Chọn một điểm nổi bật để phát triển sâu hơn: giao thông, hàng xóm, tiện ích, công viên hoặc không gian xanh.',
        'Thêm một ví dụ thật trong đời sống, chẳng hạn nơi bạn thường đi bộ, gặp bạn bè hoặc dành cuối tuần.',
        'Nếu câu hỏi có yếu tố thay đổi, so sánh quá khứ với hiện tại thay vì chỉ nói “yes/no”.',
        'Nếu hỏi về tương lai, nói nơi bạn muốn sống, lý do và điều kiện khiến bạn quyết định chuyển đi.',
        'Kết lại bằng cảm nhận cá nhân để câu trả lời tự nhiên hơn: cảm giác gắn bó, tiện lợi hoặc chất lượng cuộc sống.'
      ]
    },
    'Công việc & Học tập': {
      words:['workload','career path','practical skills','work-life balance','hands-on experience','meet deadlines'],
      ideas:[
        'Nói rõ bạn đang học ngành gì hoặc làm công việc gì, ở đâu và vai trò chính của bạn.',
        'Giải thích vì sao bạn chọn ngành/công việc đó thay vì chỉ nói rằng bạn thích nó.',
        'Đưa một nhiệm vụ hoặc môn học cụ thể để chứng minh điều bạn vừa nói.',
        'Nêu một kỹ năng quan trọng như giao tiếp, quản lý thời gian, giải quyết vấn đề hoặc kỹ năng chuyên môn.',
        'Nếu phù hợp, nhắc một khó khăn nhỏ rồi nói cách bạn xử lý; câu trả lời sẽ cân bằng và thật hơn.',
        'Mở rộng sang tương lai: mục tiêu nghề nghiệp, kỹ năng muốn cải thiện hoặc công việc bạn muốn thử.'
      ]
    },
    'Sở thích & Thời gian rảnh': {
      words:['unwind','take up a hobby','keep me motivated','spare time','clear my mind','social activity'],
      ideas:[
        'Nói hoạt động cụ thể bạn làm trong thời gian rảnh và tần suất bạn làm nó.',
        'Giải thích bạn thường làm một mình hay cùng ai, ở đâu và vào thời điểm nào.',
        'Tập trung vào lợi ích: thư giãn, vận động, sáng tạo, gặp gỡ người khác hoặc giảm căng thẳng.',
        'Kể một kỷ niệm ngắn hoặc một lần hoạt động đó khiến bạn cảm thấy đặc biệt vui.',
        'Nếu hỏi về thay đổi, so sánh sở thích hiện tại với khi còn nhỏ và giải thích nguyên nhân.',
        'Có thể thêm một sở thích bạn muốn thử trong tương lai để mở rộng tự nhiên.'
      ]
    },
    'Ẩm thực': {
      words:['home-cooked meal','balanced diet','comfort food','local cuisine','fresh ingredients','have a sweet tooth'],
      ideas:[
        'Nêu món ăn hoặc kiểu đồ ăn cụ thể trước, sau đó mô tả mùi vị, nguyên liệu hoặc cách chế biến.',
        'Giải thích khi nào bạn thường ăn món đó và bạn thường ăn cùng ai.',
        'Liên hệ món ăn với sức khỏe, thói quen gia đình, văn hóa hoặc một kỷ niệm cụ thể.',
        'Nếu nói về nhà hàng, đề cập không khí, chất lượng món ăn, giá cả và dịch vụ.',
        'Nếu hỏi về thay đổi, so sánh chế độ ăn trước đây với hiện tại và nêu nguyên nhân.',
        'Part 3 có thể cân bằng hai phía: sự tiện lợi của đồ ăn nhanh so với tác động tới sức khỏe và văn hóa ẩm thực.'
      ]
    },
    'Công nghệ': {
      words:['user-friendly','time-saving','stay connected','digital privacy','rely on technology','keep up with'],
      ideas:[
        'Nêu một thiết bị hoặc ứng dụng cụ thể thay vì nói chung chung về “technology”.',
        'Giải thích bạn dùng nó vào việc gì trong một ngày bình thường: học, làm việc, liên lạc hay giải trí.',
        'Đưa một lợi ích rõ ràng như tiết kiệm thời gian, tiếp cận thông tin hoặc giữ liên lạc.',
        'Thêm một hạn chế nhỏ như mất tập trung, phụ thuộc thiết bị, chi phí hoặc quyền riêng tư.',
        'Nếu so sánh quá khứ, nói một việc ngày trước khó hơn nhưng hiện nay công nghệ đã làm đơn giản hơn.',
        'Part 3 nên mở rộng tới xã hội: việc làm, giáo dục, giao tiếp, tự động hóa và bảo vệ dữ liệu.'
      ]
    }
  };
  var PART_HINTS = {
    1:[
      'Trả lời thẳng ngay câu đầu bằng một câu tự nhiên như “I’d say…”, “I usually…”, “Yes, definitely…” hoặc “Not really…”.',
      'Sau câu trả lời chính, thêm 1 lý do rõ ràng bằng “because / mainly because / the main reason is that…”.',
      'Thêm một chi tiết hoặc ví dụ nhỏ: thời gian, địa điểm, người bạn thường đi cùng hoặc một tình huống thật.',
      'Với thói quen/sở thích hiện tại, ưu tiên Present Simple và trạng từ như “usually, often, tend to, on a daily basis”.',
      'Với thay đổi/quá khứ, dùng “used to / when I was younger / whereas now…”; với tương lai dùng “I’d like to / I hope to / might”.',
      'Nối ý nhẹ nhàng bằng “To be honest, Specifically, Besides that, On the other hand” — không cần nhồi quá nhiều từ nối.'
    ],
    2:[
      'Mở đầu 1–2 câu để xác định rõ người/nơi/vật/sự việc bạn sẽ nói: “I’d like to talk about…”.',
      'Đi lần lượt theo cue card nhưng đừng đọc máy móc từng gạch đầu dòng; biến chúng thành một câu chuyện liền mạch.',
      'Thêm bối cảnh cụ thể: khi nào, ở đâu, với ai và điều gì đã xảy ra trước/sau sự kiện chính.',
      'Dùng chi tiết cảm giác và cảm xúc: what it looked/felt/sounded like, how you felt, why it mattered to you.',
      'Kéo dài câu trả lời bằng một kỷ niệm hoặc ví dụ thật, rồi giải thích tác động của nó tới bạn.',
      'Dùng các cụm chuyển ý tự nhiên: “What I remember most is… / Another thing worth mentioning is… / On top of that…”.',
      'Mục tiêu 1–2 phút; nếu sắp hết ý, quay lại giải thích “why” hoặc so sánh với một trải nghiệm tương tự.'
    ],
    3:[
      'Nêu quan điểm rõ ràng trước: “From my perspective… / I’d argue that… / In most cases…”.',
      'Phát triển ít nhất 2 nguyên nhân hoặc hệ quả thay vì chỉ cho một câu trả lời ngắn.',
      'Sau mỗi ý chính, thêm ví dụ thực tế hoặc một tình huống giả định để làm lập luận cụ thể hơn.',
      'Cân bằng quan điểm bằng “On the other hand / That said / Although this is true…” nếu câu hỏi có hai phía.',
      'Dùng cấu trúc phức hợp vừa phải: although, while, whereas, if, because, which, as a result.',
      'Có thể so sánh nhóm tuổi, thành thị–nông thôn, quá khứ–hiện tại hoặc cá nhân–xã hội khi phù hợp.',
      'Kết lại bằng hệ quả dài hạn hoặc giải pháp: “In the long run… / A practical way to address this would be…”.'
    ]
  };

  var QUESTION_IDEAS = {
    'Do you work or are you a student?':[
      'Mở đầu thật rõ: “I’m currently a university student…” hoặc “I work as a…”.',
      'Nói chuyên ngành/vị trí công việc và nơi bạn học/làm.',
      'Giải thích ngắn vì sao bạn chọn hướng đó hoặc điều gì khiến bạn hứng thú.',
      'Nhắc một môn học/nhiệm vụ bạn thường làm để câu trả lời có chi tiết thật.',
      'Có thể kết bằng mục tiêu sắp tới: tốt nghiệp, tìm việc, thăng tiến hoặc học thêm kỹ năng.'
    ],
    'What do you like about your job or your studies?':[
      'Chọn 1–2 điều cụ thể bạn thực sự thích: môi trường, kiến thức, đồng nghiệp, tính sáng tạo hoặc cơ hội phát triển.',
      'Giải thích vì sao điều đó quan trọng với bạn.',
      'Đưa một ví dụ gần đây chứng minh điều bạn vừa nói.',
      'Nếu muốn câu trả lời tự nhiên hơn, thêm một điểm hơi khó nhưng vẫn đáng làm.'
    ],
    'What was your first day like?':[
      'Nói thời điểm và bối cảnh của ngày đầu tiên.',
      'Miêu tả cảm xúc lúc đầu: nervous, excited, overwhelmed, curious…',
      'Kể một việc cụ thể đã xảy ra hoặc một người đã giúp bạn.',
      'Kết lại bằng cảm giác cuối ngày và điều bạn học được.'
    ],
    'What skills are important in your field?':[
      'Nêu 2 kỹ năng: một kỹ năng chuyên môn và một kỹ năng mềm.',
      'Giải thích mỗi kỹ năng được dùng trong tình huống nào.',
      'Cho ví dụ từ việc học/công việc của chính bạn.',
      'Có thể nói kỹ năng nào bạn đang cố cải thiện và bằng cách nào.'
    ]
  };
  var TRANSLATIONS = {
    'Do you live in a house or an apartment?':'Bạn sống trong nhà riêng hay căn hộ?',
    'What do you like most about your hometown?':'Bạn thích điều gì nhất ở quê hương mình?',
    'Has your hometown changed much since you were a child?':'Quê hương của bạn đã thay đổi nhiều kể từ khi bạn còn nhỏ chưa?',
    'Would you like to live somewhere else in the future?':'Trong tương lai bạn có muốn sống ở nơi khác không?',
    'Do you work or are you a student?':'Bạn đang đi làm hay là sinh viên?',
    'What do you like about your job or your studies?':'Bạn thích điều gì ở công việc hoặc việc học của mình?',
    'What was your first day like?':'Ngày đầu tiên của bạn diễn ra như thế nào?',
    'What skills are important in your field?':'Những kỹ năng nào quan trọng trong lĩnh vực của bạn?',
    'What do you usually do in your free time?':'Bạn thường làm gì vào thời gian rảnh?',
    'Have your hobbies changed since you were a child?':'Sở thích của bạn có thay đổi từ khi còn nhỏ không?',
    'Do you prefer indoor or outdoor activities?':'Bạn thích hoạt động trong nhà hay ngoài trời hơn?',
    'How important is it for people to have hobbies?':'Việc có sở thích quan trọng với mọi người đến mức nào?',
    'What is your favourite food?':'Món ăn yêu thích của bạn là gì?',
    'Do you enjoy cooking?':'Bạn có thích nấu ăn không?',
    'What kind of restaurants do you like?':'Bạn thích loại nhà hàng nào?',
    'Has your diet changed over the years?':'Chế độ ăn của bạn có thay đổi theo thời gian không?',
    'What kind of technology do you use every day?':'Bạn sử dụng loại công nghệ nào mỗi ngày?',
    'Do you find it easy to learn new technology?':'Bạn có thấy dễ học cách dùng công nghệ mới không?',
    'Was technology very different when you were a child?':'Công nghệ khi bạn còn nhỏ có rất khác bây giờ không?',
    'What device could you not live without?':'Thiết bị nào bạn cảm thấy không thể thiếu?',
    'Describe a place in your hometown that you enjoy visiting.':'Hãy miêu tả một nơi ở quê hương mà bạn thích ghé thăm.',
    'Why do people move away from small towns to big cities?':'Vì sao mọi người rời thị trấn nhỏ để chuyển đến các thành phố lớn?',
    'What are the advantages and disadvantages of living in a big city?':'Những lợi ích và bất lợi của việc sống ở một thành phố lớn là gì?',
    'How might towns and cities change in the future?':'Các thị trấn và thành phố có thể thay đổi như thế nào trong tương lai?',
    'Should governments invest more in rural areas or urban areas?':'Chính phủ nên đầu tư nhiều hơn vào khu vực nông thôn hay đô thị?',
    'Describe a job you would like to have in the future.':'Hãy miêu tả một công việc bạn muốn làm trong tương lai.',
    'How has the nature of work changed in recent years?':'Bản chất công việc đã thay đổi như thế nào trong những năm gần đây?',
    'Do you think job satisfaction is more important than salary?':'Bạn có nghĩ sự hài lòng trong công việc quan trọng hơn mức lương không?',
    'What impact does technology have on the way people work?':'Công nghệ tác động như thế nào đến cách mọi người làm việc?',
    'Should people change careers several times in their life?':'Mọi người có nên đổi nghề nhiều lần trong đời không?',
    'Describe a hobby or activity you enjoy doing.':'Hãy miêu tả một sở thích hoặc hoạt động bạn thích làm.',
    "Why do you think people's hobbies change as they get older?":'Vì sao bạn nghĩ sở thích của mọi người thay đổi khi họ lớn tuổi hơn?',
    'Do you think hobbies are more important now than in the past?':'Bạn có nghĩ sở thích hiện nay quan trọng hơn trước đây không?',
    'Should schools encourage students to have hobbies?':'Trường học có nên khuyến khích học sinh có sở thích riêng không?',
    'How do hobbies benefit mental health?':'Sở thích mang lại lợi ích gì cho sức khỏe tinh thần?',
    'Describe a meal you really enjoyed.':'Hãy miêu tả một bữa ăn mà bạn thực sự yêu thích.',
    'How have eating habits changed in your country?':'Thói quen ăn uống ở đất nước bạn đã thay đổi như thế nào?',
    'What are the effects of fast food on health?':'Thức ăn nhanh ảnh hưởng như thế nào đến sức khỏe?',
    'Do you think traditional cooking skills are disappearing?':'Bạn có nghĩ các kỹ năng nấu ăn truyền thống đang dần biến mất không?',
    'Should governments regulate unhealthy food advertising?':'Chính phủ có nên kiểm soát quảng cáo thực phẩm không lành mạnh không?',
    'Describe a piece of technology you find useful.':'Hãy miêu tả một thiết bị hoặc công nghệ mà bạn thấy hữu ích.',
    'How has technology changed the way people communicate?':'Công nghệ đã thay đổi cách mọi người giao tiếp như thế nào?',
    'What are the disadvantages of relying too much on technology?':'Những bất lợi của việc phụ thuộc quá nhiều vào công nghệ là gì?',
    'Do you think technology will replace human jobs in the future?':'Bạn có nghĩ công nghệ sẽ thay thế việc làm của con người trong tương lai không?',
    'How can people protect their privacy in the digital age?':'Mọi người có thể bảo vệ quyền riêng tư như thế nào trong thời đại số?'
  };

 global.BandRoomData={TOPICS:TOPICS,TOPIC_SUPPORT:TOPIC_SUPPORT,PART_HINTS:PART_HINTS,QUESTION_IDEAS:QUESTION_IDEAS,TRANSLATIONS:TRANSLATIONS};
})(window);
