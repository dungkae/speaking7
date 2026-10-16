/* Hướng dẫn trả lời theo câu hỏi. Chỉ cung cấp học liệu, không can thiệp chấm bài. */
(function (global) {
  'use strict';
  var PROFILES = {
  "Nơi ở & Quê hương": {
    "words": [
      "residential area — khu dân cư",
      "within walking distance — cách một quãng đi bộ",
      "sense of community — sự gắn kết cộng đồng",
      "affordable housing — nhà ở vừa túi tiền",
      "green spaces — không gian xanh",
      "cost of living — chi phí sinh hoạt"
    ],
    "focus": [
      "Gọi tên loại nhà ngay câu đầu: “I live in a…”, rồi dùng “which” thêm đặc điểm căn nhà.",
      "Chọn đúng một điểm thích nhất; dùng “What I like most is…” rồi giải thích tác động đến sinh hoạt.",
      "Đặt hai mốc cạnh nhau: “There used to be…” và “These days…”, sau đó nêu cảm nhận về thay đổi.",
      "Tách mong muốn khỏi kế hoạch chắc chắn: “I’d like to…, provided that…”; nói rõ điều kiện chuyển nhà.",
      "Mở bằng tên địa điểm; nối vị trí → lần ghé gần nhất → hoạt động → lý do muốn quay lại, tránh chỉ liệt kê tiện ích.",
      "Phân biệt lý do rời nơi cũ và sức hút nơi mới bằng “pushes people away” / “draws them to…”.",
      "Dùng cùng một tiêu chí để cân bằng hai mặt: “Although city life offers…, it also…”.",
      "Dự đoán bằng “may become” hoặc “is likely to”; giải thích xu hướng hiện tại làm căn cứ.",
      "Nêu tiêu chí ưu tiên đầu tư trước, rồi dùng “whereas” so sánh nhu cầu của hai khu vực."
    ]
  },
  "Công việc & Học tập": {
    "words": [
      "hands-on experience — kinh nghiệm thực hành",
      "meet deadlines — hoàn thành đúng hạn",
      "career prospects — triển vọng nghề nghiệp",
      "job satisfaction — sự hài lòng với công việc",
      "workload — khối lượng công việc",
      "transferable skills — kỹ năng dùng được ở nhiều công việc"
    ],
    "focus": [
      "Trả lời rõ “I’m a student…” hoặc “I work as…”; sau đó thêm ngành học hoặc nhiệm vụ chính.",
      "Chọn một khía cạnh công việc/học tập; dùng “What I enjoy about it is…” và một tình huống minh họa.",
      "Kể theo ba mốc đầu ngày, việc xảy ra, cuối ngày; dùng quá khứ đơn và từ chỉ cảm xúc.",
      "Nêu kỹ năng bằng danh từ/cụm V-ing rồi nối công dụng: “…is essential because it helps me…”.",
      "Giới thiệu nghề bằng “I’d like to become…”; dùng “would need” cho bằng cấp và “would involve” cho nhiệm vụ.",
      "So sánh một nhiệm vụ trước và nay; dùng hiện tại hoàn thành cho thay đổi, quá khứ đơn cho ví dụ cũ.",
      "Định nghĩa mức lương đủ sống trước khi so sánh; diễn đạt mức độ đồng ý thay vì khẳng định một phía luôn đúng.",
      "Trình bày cơ chế: công cụ thay đổi thao tác nào, thao tác đó ảnh hưởng năng suất hay hợp tác ra sao.",
      "Dùng “It depends on…” để đặt điều kiện đổi nghề; so sánh lợi ích kỹ năng với thời gian đào tạo lại."
    ]
  },
  "Sở thích & Thời gian rảnh": {
    "words": [
      "take up a hobby — bắt đầu một sở thích",
      "unwind after work — thư giãn sau công việc",
      "set aside time — dành riêng thời gian",
      "creative outlet — cách giải tỏa qua sáng tạo",
      "stay motivated — giữ động lực",
      "a sense of achievement — cảm giác thành tựu"
    ],
    "focus": [
      "Nêu hoạt động với trạng từ tần suất: “I usually spend… doing…”; thêm thời điểm cụ thể trong tuần.",
      "Dùng “used to” cho sở thích cũ và “have become interested in” cho sở thích mới; giải thích bước chuyển.",
      "Chọn một phía bằng “I tend to prefer…” rồi thêm hoàn cảnh bạn sẽ chọn phía còn lại.",
      "Nêu mức độ quan trọng rồi giải thích một lợi ích bằng quan hệ nguyên nhân–kết quả.",
      "Chuyển từ lần đầu làm quen ở quá khứ sang thói quen hiện tại; kể một tiến bộ nhỏ để làm rõ sự yêu thích.",
      "Liên kết giai đoạn tuổi với thay đổi nhu cầu; dùng “As people get older…” thay vì chỉ liệt kê nhóm tuổi.",
      "Giữ cùng tiêu chí khi so sánh hiện tại/quá khứ; tránh suy ra mọi người ngày xưa đều ít căng thẳng.",
      "Nêu mức hỗ trợ của trường bằng “could” / “should”; thêm điều kiện để sở thích không thành áp lực.",
      "Giải thích chuỗi hoạt động → thay đổi cảm xúc → tác động hằng ngày; tránh hứa hẹn chữa bệnh."
    ]
  },
  "Ẩm thực": {
    "words": [
      "home-cooked meal — bữa cơm nhà",
      "fresh ingredients — nguyên liệu tươi",
      "balanced diet — chế độ ăn cân bằng",
      "local cuisine — ẩm thực địa phương",
      "rich in flavour — đậm đà hương vị",
      "convenience food — thực phẩm chế biến tiện lợi"
    ],
    "focus": [
      "Gọi tên món trước, giải thích ngắn nếu là món Việt; mô tả một vị hoặc kết cấu bằng tính từ cụ thể.",
      "Nói mức độ thích nấu ăn rồi một món bạn tự làm được; dùng “I’m quite good at making…”.",
      "Phân biệt loại nhà hàng với món ăn; dùng “I look for…” để nêu tiêu chí chọn nơi ăn.",
      "So sánh một thói quen ăn cũ/mới bằng “I’ve cut down on…” hoặc “I’ve started eating…”.",
      "Kể bữa ăn như một sự kiện: nơi chốn và người đi cùng trước, món ăn sau; kết bằng điều khiến nó đáng nhớ.",
      "Chọn một thay đổi cụ thể trong cách ăn, rồi giải thích nguyên nhân; tránh khái quát toàn bộ đất nước.",
      "Dùng “can contribute to” cho tác động sức khỏe; phân biệt ăn thỉnh thoảng với ăn thường xuyên.",
      "Giải thích “disappearing” là ít người biết nấu hay ít người nấu; dùng ví dụ để bảo vệ nhận định.",
      "Nêu đối tượng và mức hạn chế quảng cáo; phân biệt “restrict” với “ban” để lập luận chính xác."
    ]
  },
  "Công nghệ": {
    "words": [
      "user-friendly — dễ sử dụng",
      "automate routine tasks — tự động hóa việc lặp lại",
      "digital privacy — quyền riêng tư số",
      "rely on technology — phụ thuộc công nghệ",
      "save time — tiết kiệm thời gian",
      "keep up with advances — theo kịp tiến bộ"
    ],
    "focus": [
      "Chọn thiết bị hoặc công cụ dùng mỗi ngày; mô tả tác vụ bằng “I use it to…” thay vì liệt kê tên.",
      "Nêu mức độ dễ học rồi một lần bạn phải thử lại; dùng “Once I…, it becomes easier to…”.",
      "Dùng quá khứ đơn cho công nghệ thời nhỏ, hiện tại đơn cho hiện nay; so sánh cùng một việc.",
      "Giải thích “không thể thiếu” bằng một việc khó làm khi không có thiết bị: “Without it, I’d…”.",
      "Nêu thiết bị, thời gian sở hữu bằng “I’ve had it for…” và minh họa một lần nó giải quyết vấn đề.",
      "Đặt cách liên lạc cũ/mới cạnh nhau; nói rõ tốc độ thay đổi có ảnh hưởng gì đến chất lượng giao tiếp.",
      "Triển khai một rủi ro qua tình huống cụ thể; dùng “If…, people may…” để tránh kết luận tuyệt đối.",
      "Phân biệt thay thế nhiệm vụ và thay thế cả nghề; dùng “some roles” để giới hạn dự đoán.",
      "Trình bày từng biện pháp kèm rủi ro nó giảm; dùng “By doing…, users can…” cho cấu trúc giải pháp."
    ]
  },
  "Gia đình & Bạn bè": {
    "words": [
      "keep in touch — giữ liên lạc",
      "turn to someone — tìm đến ai để nhờ giúp",
      "mutual trust — sự tin tưởng lẫn nhau",
      "quality time — thời gian bên nhau có ý nghĩa",
      "a close-knit family — gia đình gắn bó",
      "resolve disagreements — giải quyết bất đồng"
    ],
    "focus": [
      "Nói tần suất trước: “We usually get together…”; phân biệt ở cùng nhà với thực sự dành thời gian trò chuyện.",
      "Nêu người bạn tìm đến rồi lĩnh vực họ tư vấn; dùng “Whenever I need help with…, I…”.",
      "Chọn cách gặp ưu tiên và giải thích điểm khác biệt; thêm ngoại lệ bằng “unless…”.",
      "Nêu một phẩm chất và hành vi chứng minh; dùng “A good friend is someone who…”.",
      "Giới thiệu quan hệ thật ngắn; dành phần chính cho khó khăn, hành động giúp đỡ và điều đã thay đổi sau đó.",
      "So sánh một khía cạnh quan hệ gia đình qua hai thế hệ; giải thích nguyên nhân thay vì đánh giá thế hệ nào tốt hơn.",
      "Chọn hai giai đoạn tuổi và đối chiếu nhu cầu kết bạn bằng “while” hoặc “whereas”.",
      "Tách việc duy trì tình bạn đã có khỏi kết bạn mới; đưa điều kiện bằng “as long as…”.",
      "Nêu kỹ năng xã hội cụ thể và cách dạy; đánh giá vai trò trường bên cạnh gia đình."
    ]
  },
  "Du lịch & Kỳ nghỉ": {
    "words": [
      "travel at your own pace — đi theo nhịp độ của mình",
      "local customs — phong tục địa phương",
      "off the beaten track — ít du khách biết đến",
      "tourist attractions — điểm thu hút du khách",
      "local economy — kinh tế địa phương",
      "overcrowding — tình trạng quá đông"
    ],
    "focus": [
      "Nói cảm nhận về du lịch rồi lý do gắn với trải nghiệm; “What appeals to me is…”.",
      "Trả lời nơi đến và thời gian trước; dùng quá khứ đơn để kể một hoạt động trong chuyến gần nhất.",
      "So sánh cùng một nhu cầu khi đi một mình/cùng người khác; không cần kể cả hai chuyến dài.",
      "Nêu loại địa điểm và lý do muốn tới bằng “I’d love to visit… because…”.",
      "Dùng trình tự khởi hành → điểm nhấn → cảm nhận sau chuyến đi; chọn một sự việc thay vì kể lịch trình từng giờ.",
      "Giải thích tiền du khách chi tiêu đến người dân qua đâu; dùng một mắt xích cụ thể để chứng minh lợi ích.",
      "Chọn một vấn đề rồi mô tả hậu quả với cư dân; phân biệt lượng khách cao và quản lý kém.",
      "Dùng dự đoán có điều kiện: “If… becomes more affordable, people may…”.",
      "Nêu mục tiêu chính sách rồi cách khuyến khích du lịch trong nước; đánh giá một giới hạn thực tế."
    ]
  },
  "Âm nhạc": {
    "words": [
      "live performance — biểu diễn trực tiếp",
      "catchy melody — giai điệu dễ nhớ",
      "play an instrument — chơi nhạc cụ",
      "lift my mood — cải thiện tâm trạng",
      "stream music — nghe nhạc trực tuyến",
      "cultural heritage — di sản văn hóa"
    ],
    "focus": [
      "Nêu thể loại trước rồi một đặc điểm âm thanh; “I’m particularly into…” phù hợp câu trả lời tự nhiên.",
      "Gắn âm nhạc với một thời điểm và mục đích: “I tend to listen to… when…”.",
      "Trả lời có/không đúng trải nghiệm; nếu có dùng quá khứ đơn, nếu không nói nhạc cụ từng muốn học.",
      "So sánh trải nghiệm nghe trực tiếp/bản thu theo một tiêu chí; thêm lý do lựa chọn cá nhân.",
      "Giới thiệu bài hát và lần đầu nghe ở quá khứ; chuyển hiện tại khi giải thích cảm xúc mỗi lần nghe lại.",
      "Chọn một chức năng của âm nhạc trong văn hóa và giải thích nó được thực hiện thế nào.",
      "Nêu thay đổi trong khâu sản xuất, phân phối hoặc thu nhập; chỉ chọn một khâu để phân tích rõ.",
      "Đặt lợi ích cạnh điều kiện học phù hợp; tránh coi học nhạc cụ là nghĩa vụ với mọi trẻ.",
      "Mô tả một yếu tố độc đáo của buổi diễn rồi giải thích ảnh hưởng lên người nghe."
    ]
  },
  "Phim ảnh & Truyền hình": {
    "words": [
      "thought-provoking — gợi suy nghĩ",
      "storyline — cốt truyện",
      "character development — sự phát triển nhân vật",
      "streaming platform — nền tảng xem trực tuyến",
      "on-screen representation — cách thể hiện trên màn ảnh",
      "local film industry — ngành phim trong nước"
    ],
    "focus": [
      "Gọi tên thể loại rồi điều bạn tìm kiếm trong phim; dùng “I enjoy films that…”.",
      "Nêu lựa chọn với một tiêu chí thực tế rồi ngoại lệ; “For…, I’d rather…, but…”.",
      "Nêu người thường xem cùng và cách cùng chọn phim; đừng chuyển sang tóm tắt phim.",
      "Chọn một thay đổi về thời gian hoặc cách xem; dùng “I’ve started…” và nguyên nhân.",
      "Tóm tắt cốt truyện trong vài câu; tập trung vào vấn đề phim khiến bạn suy nghĩ và quan điểm thay đổi ra sao.",
      "Nêu dạng ảnh hưởng cụ thể và cơ chế; dùng “can influence” thay cho “make everyone…”.",
      "Phân biệt phản ánh vấn đề xã hội và nhiệm vụ giải trí; nêu điều kiện khiến cách phản ánh hiệu quả.",
      "So sánh quyền lựa chọn nội dung hoặc thời gian xem trước/sau streaming; thêm một mặt hạn chế.",
      "Nêu giá trị của phim địa phương bằng “allows audiences to…” rồi ví dụ khái quát, không cần số liệu."
    ]
  },
  "Sách & Đọc sách": {
    "words": [
      "get absorbed in a book — bị cuốn vào sách",
      "a gripping story — câu chuyện cuốn hút",
      "reading habit — thói quen đọc",
      "broaden my perspective — mở rộng góc nhìn",
      "printed edition — bản in",
      "spark imagination — khơi gợi trí tưởng tượng"
    ],
    "focus": [
      "Nói mức độ thích đọc và một hoàn cảnh bạn đọc; nếu ít đọc hãy trả lời thật rồi giải thích.",
      "Nêu thể loại cùng lý do bằng “I tend to go for… because…”; không chỉ kể tên sách.",
      "Kể người đọc cho bạn và bối cảnh bằng quá khứ đơn; “used to read to me” hợp thói quen lặp lại.",
      "Đối chiếu hai định dạng qua cùng tiêu chí; dùng “Although…, I still prefer…”.",
      "Nêu nội dung sách thật ngắn; dành thời gian cho điều học được và người có thể thấy sách hữu ích.",
      "Nêu một cách khuyến khích rồi giải thích tác động đến động lực đọc; phân biệt khuyến khích với ép đọc.",
      "Giới hạn dự đoán theo nhóm người đọc hoặc mục đích; dùng “may coexist” nếu cho rằng hai loại cùng tồn tại.",
      "Liên hệ nhu cầu người đọc với thể loại; tránh biến câu hỏi thành danh sách sở thích riêng.",
      "Giải thích quá trình người đọc hình dung cảnh/nhân vật; đưa một tình huống minh họa."
    ]
  },
  "Thể thao & Vận động": {
    "words": [
      "team spirit — tinh thần đồng đội",
      "build stamina — tăng sức bền",
      "stay active — duy trì vận động",
      "sports facilities — cơ sở thể thao",
      "fair play — tinh thần thi đấu công bằng",
      "physical education — giáo dục thể chất"
    ],
    "focus": [
      "Nêu môn thể thao và mức độ tham gia; phân biệt thích chơi với thích xem.",
      "Gọi tên môn phổ biến rồi dấu hiệu bạn quan sát được; dùng “From what I’ve seen…”.",
      "Kể môn từng chơi bằng “I used to…” và một kỷ niệm ngắn ở trường.",
      "So sánh động lực trong hoạt động đồng đội/cá nhân; “I work better when…” giúp lý do rõ.",
      "Dùng “I’d like to try…” và điều kiện học môn đó; hình dung một buổi thử thay vì giả vờ đã trải nghiệm.",
      "Liên kết khoản đầu tư với nhóm sử dụng cụ thể; nêu kết quả cộng đồng có thể nhận được.",
      "Mô tả cách thành viên phối hợp rồi kỹ năng hình thành; tránh chỉ liệt kê lợi ích.",
      "Nêu mức tăng thời lượng hợp lý và điều kiện triển khai; không đồng nhất thêm giờ với hiệu quả.",
      "Chọn một ứng dụng công nghệ và giải thích nó thay đổi quyết định hay kết quả thi đấu thế nào."
    ]
  },
  "Thiên nhiên & Môi trường": {
    "words": [
      "green spaces — không gian xanh",
      "reduce waste — giảm rác thải",
      "natural habitat — môi trường sống tự nhiên",
      "environmental footprint — tác động lên môi trường",
      "protect biodiversity — bảo vệ đa dạng sinh học",
      "reusable products — sản phẩm dùng lại được"
    ],
    "focus": [
      "Nêu hoạt động ngoài trời cụ thể rồi cảm giác nó mang lại; giữ trọng tâm ở trải nghiệm cá nhân.",
      "Trả lời vị trí bằng “There’s a… near…”; nếu không có, nói nơi xanh gần nhất bạn biết.",
      "Chọn một vấn đề quan sát được và dấu hiệu của nó; tránh khẳng định số liệu chưa biết.",
      "Nêu một hành động thực tế với tần suất; “I try to…” cho thấy nỗ lực mà không tuyệt đối hóa.",
      "Nói rõ đây là nơi chưa tới; dùng “would” cho hoạt động dự định và hiện tại đơn cho đặc điểm đã biết.",
      "Nêu công cụ bảo vệ đất xanh và cách thực hiện; thêm trở ngại khi nhu cầu xây dựng tăng.",
      "Liên kết hành động cá nhân với loại ô nhiễm cụ thể; tránh lẫn giảm rác với giảm mọi dạng ô nhiễm.",
      "Xác định trách nhiệm doanh nghiệp với tác động họ gây ra; phân biệt trách nhiệm trực tiếp và gián tiếp.",
      "Mô tả một cách học trải nghiệm và điều người học nhận ra; giải thích vì sao dễ nhớ hơn thông tin đơn thuần."
    ]
  },
  "Giáo dục & Trường học": {
    "words": [
      "hands-on learning — học qua thực hành",
      "constructive feedback — phản hồi mang tính xây dựng",
      "learning pace — tốc độ học",
      "critical thinking — tư duy phản biện",
      "equal access — cơ hội tiếp cận bình đẳng",
      "continuous assessment — đánh giá liên tục"
    ],
    "focus": [
      "Gọi tên môn yêu thích ở quá khứ rồi một tiết học giúp giải thích vì sao.",
      "Nêu cách học và tình huống cách đó hiệu quả; dùng “I learn best when…”.",
      "Nói mức độ thích học cùng bạn rồi cách phân chia việc hoặc trao đổi kiến thức.",
      "Chọn một điều muốn học và mục đích sử dụng; “I’d like to learn how to…” theo sau động từ.",
      "Giới thiệu giáo viên ngắn; kể một cách hỗ trợ cụ thể, phản ứng của bạn và kết quả học tập.",
      "Nêu một năng lực tương lai rồi cách rèn trong lớp; tránh chỉ lập danh sách môn học mới.",
      "Giải thích lợi ích với một nhóm học sinh cụ thể; thêm điều kiện như thiết bị hoặc tự quản lý.",
      "Định nghĩa thứ cần đánh giá rồi so sánh bài thi với một phương pháp khác trên cùng tiêu chí.",
      "Nêu rào cản trước, giải pháp sau; dùng “By removing…, schools can…” để mạch lập luận rõ."
    ]
  },
  "Lễ hội & Truyền thống": {
    "words": [
      "pass down traditions — truyền lại truyền thống",
      "family gathering — buổi sum họp gia đình",
      "cultural identity — bản sắc văn hóa",
      "mark an occasion — kỷ niệm một dịp",
      "local customs — phong tục địa phương",
      "a sense of belonging — cảm giác thuộc về cộng đồng"
    ],
    "focus": [
      "Nêu một lễ hội chính và hoạt động bạn tham gia; giải thích tên riêng nếu cần.",
      "Trả lời cảm nhận thật rồi một phần của lễ hội bạn thích hoặc không thích.",
      "Dùng hiện tại đơn cho thói quen dịp đặc biệt; sắp các hoạt động theo thời gian.",
      "Chọn một phong tục thay đổi rồi đối chiếu cách làm cũ/mới bằng “used to… but now…”.",
      "Kể bối cảnh, người tham dự, một khoảnh khắc nổi bật; giải thích vì sao dịp đó khác ngày thường.",
      "Giải thích giá trị một truyền thống mang lại; tách bảo tồn ý nghĩa khỏi giữ nguyên mọi hình thức.",
      "Trình bày một tác động tích cực và một sức ép của du lịch lên cùng lễ hội.",
      "Phân biệt các nhóm người trẻ bằng “some… while others…”; tránh kết luận cho cả thế hệ.",
      "Mô tả một hoạt động chung dẫn đến giao tiếp/hợp tác ra sao; kết nối hoạt động với sự gắn bó."
    ]
  },
  "Mua sắm & Tiêu dùng": {
    "words": [
      "value for money — đáng tiền",
      "compare prices — so sánh giá",
      "impulse purchase — mua bốc đồng",
      "customer reviews — đánh giá của khách hàng",
      "durable products — sản phẩm bền",
      "consumer habits — thói quen tiêu dùng"
    ],
    "focus": [
      "Nói cảm nhận về mua sắm và loại hàng bạn thích chọn; nếu không thích hãy nêu lý do thật.",
      "So sánh kênh mua hàng theo một tiêu chí; thêm nhóm hàng bạn vẫn muốn kiểm tra trực tiếp.",
      "Nói món mua gần đây bằng quá khứ đơn; thêm một lý do mua và nhận xét sau khi sử dụng.",
      "Nêu quy trình so sánh giá và khi nào bạn làm; “Before buying…, I usually…”.",
      "Kể nhu cầu trước lúc mua, cách chọn và một lần sử dụng; chứng minh “useful” bằng kết quả thực tế.",
      "Giải thích cơ chế mua online thay đổi lượng khách hoặc cách bán của cửa hàng địa phương.",
      "Phân biệt nhu cầu thực và động lực cảm xúc; dùng ví dụ để nối quảng cáo với hành vi mua.",
      "Nêu vì sao trẻ em dễ bị ảnh hưởng rồi mức giới hạn phù hợp; không chỉ nói quảng cáo tốt/xấu.",
      "Chọn một cách mua bền vững và giải thích tiêu chí quyết định; thêm khó khăn về giá hoặc khả năng tiếp cận."
    ]
  },
  "Giao thông & Đi lại": {
    "words": [
      "public transport — giao thông công cộng",
      "traffic congestion — ùn tắc giao thông",
      "rush hour — giờ cao điểm",
      "daily commute — việc đi lại hằng ngày",
      "pedestrian-friendly — thuận tiện cho người đi bộ",
      "charging infrastructure — hạ tầng sạc"
    ],
    "focus": [
      "Nêu phương tiện chính và chặng thường đi; dùng “I mostly get around by…”.",
      "Trả lời tần suất sử dụng rồi một điểm thuận tiện/bất tiện; giữ trải nghiệm cá nhân ở Part 1.",
      "Định vị con đường rồi mô tả lúc đông nhất; dùng “It gets particularly busy when…”.",
      "Nói mong muốn và điều kiện để đạp xe thường xuyên hơn; dùng “I would…, if…”.",
      "Mô tả chuyến đi lặp lại bằng hiện tại đơn; thêm một lần đặc biệt ở quá khứ để câu chuyện có điểm nhấn.",
      "Chọn vấn đề người dùng gặp trước khi đưa giải pháp; giải thích vì sao giải pháp khiến họ đổi thói quen.",
      "Phân tích một nguyên nhân về nhu cầu và một nguyên nhân về hệ thống; tránh chỉ nói có quá nhiều xe.",
      "So sánh xe điện theo sử dụng và hạ tầng; dùng “While…, …still…” để cân bằng hai phía.",
      "Nêu lợi ích cho người đi bộ rồi đánh giá nhu cầu người còn phải đi xe; đề xuất điều kiện bố trí hợp lý."
    ]
  },
  "Sức khỏe & Thói quen tốt": {
    "words": [
      "consistent routine — nếp sinh hoạt đều đặn",
      "get enough rest — nghỉ ngơi đầy đủ",
      "stay hydrated — uống đủ nước",
      "manage stress — kiểm soát căng thẳng",
      "sedentary lifestyle — lối sống ít vận động",
      "maintain a habit — duy trì thói quen"
    ],
    "focus": [
      "Nêu một hoặc hai thói quen thực sự duy trì; giải thích chúng phù hợp lịch sinh hoạt thế nào.",
      "Nói lượng ngủ của bản thân rồi cảm nhận buổi sáng; phân biệt thời gian ngủ và chất lượng ngủ.",
      "Mô tả một cách thư giãn cùng hoàn cảnh dùng nó; “What helps me switch off is…”.",
      "Dùng hiện tại hoàn thành cho thay đổi gần đây, rồi quá khứ đơn cho thời điểm bắt đầu.",
      "Kể lý do bắt đầu, cách duy trì và khó khăn đã vượt qua; dùng hiện tại khi nói lợi ích đang nhận thấy.",
      "Nêu cách chính phủ tạo điều kiện rồi giải thích ảnh hưởng hành vi; tránh chỉ yêu cầu người dân cố gắng.",
      "Giải thích một rào cản qua tình huống đời thường; phân biệt thiếu động lực và thiếu điều kiện.",
      "Nêu kỹ năng sức khỏe trường có thể dạy và cách thực hành; giới hạn vai trò trường hợp lý.",
      "Liên kết đặc điểm công việc với tác động sức khỏe; đưa điều kiện giảm tác động thay vì kết luận mọi việc hiện đại đều có hại."
    ]
  },
  "Internet & Mạng xã hội": {
    "words": [
      "screen time — thời gian dùng màn hình",
      "reliable sources — nguồn đáng tin cậy",
      "privacy settings — cài đặt riêng tư",
      "stay connected — giữ kết nối",
      "digital literacy — kỹ năng hiểu và sử dụng môi trường số",
      "verify information — kiểm chứng thông tin"
    ],
    "focus": [
      "Nêu tần suất hoặc thời điểm dùng; “I check… a few times a day” rõ hơn “very often”.",
      "Chọn hoạt động online chính và mục đích; mô tả một lần sử dụng thay vì liệt kê ứng dụng.",
      "Nêu loại tài khoản học tập theo dõi rồi điều áp dụng được; nếu không theo dõi hãy trả lời thật.",
      "Nói mức độ muốn giảm và phần thời gian có thể giảm; “I’d like to cut back on…”.",
      "Giới thiệu chức năng app bằng một câu; kể một tác vụ nó giúp bạn hoàn thành và lý do bạn tiếp tục dùng.",
      "So sánh một cách giao tiếp trước/sau mạng xã hội; phân biệt tần suất liên lạc và mức độ thân thiết.",
      "Đưa các bước kiểm tra nguồn và bằng chứng theo thứ tự; giải thích vì sao một bước phát hiện sai lệch.",
      "Nêu năng lực số cụ thể cần dạy rồi tình huống học sinh áp dụng; tránh chỉ nói dạy dùng máy tính.",
      "Gắn từng biện pháp riêng tư với một nguy cơ cụ thể; “This reduces the risk of…” nối hành động và hiệu quả."
    ]
  },
  "Thời tiết & Mùa": {
    "words": [
      "humid climate — khí hậu ẩm",
      "heavy rainfall — mưa lớn",
      "weather forecast — dự báo thời tiết",
      "extreme weather — thời tiết cực đoan",
      "change of plans — thay đổi kế hoạch",
      "adapt to conditions — thích nghi với điều kiện"
    ],
    "focus": [
      "Mô tả đặc điểm chung bằng hiện tại đơn, rồi nhắc khác biệt giữa hai mùa nếu có.",
      "Nêu mùa yêu thích cùng hoạt động phù hợp; “I prefer… because it allows me to…”.",
      "Nêu một loại kế hoạch bị ảnh hưởng rồi ví dụ ngắn; dùng “Whenever it…, I…”.",
      "Nêu hiện tượng và thời điểm bằng quá khứ đơn; mô tả điều bạn quan sát thay vì suy diễn nguyên nhân.",
      "Dùng quá khứ tiếp diễn cho kế hoạch đang diễn ra, quá khứ đơn cho thời tiết thay đổi và hành động thay thế.",
      "Chọn một mặt đời sống rồi giải thích con người thích nghi; tách khí hậu lâu dài với thời tiết từng ngày.",
      "Nêu nhóm cần dự báo và quyết định họ phải đưa ra; giải thích hậu quả khi thiếu thông tin.",
      "Phân biệt chuẩn bị trước sự kiện và phản ứng lúc xảy ra; chọn một biện pháp ở mỗi giai đoạn.",
      "Gọi tên nguy cơ địa phương rồi giải pháp thích nghi; không nhầm thích nghi với giảm nguyên nhân biến đổi khí hậu."
    ]
  },
  "Động vật & Thú cưng": {
    "words": [
      "look after a pet — chăm sóc thú cưng",
      "natural habitat — môi trường sống tự nhiên",
      "endangered species — loài có nguy cơ tuyệt chủng",
      "animal welfare — phúc lợi động vật",
      "wildlife reserve — khu bảo tồn động vật",
      "responsible ownership — nuôi có trách nhiệm"
    ],
    "focus": [
      "Nêu mức độ thích động vật và một trải nghiệm thật; không cần nói thích mọi loài.",
      "Dùng hiện tại hoàn thành để trả lời từng nuôi chưa, quá khứ đơn để kể về một con vật cụ thể.",
      "Chọn một loài phổ biến và nơi thường thấy; “You often see… around…” giúp trả lời trực tiếp.",
      "Nêu mong muốn rồi điều muốn quan sát; dùng “I’d be interested in seeing…”.",
      "Mô tả môi trường sống, một đặc điểm và hành vi đáng chú ý; dành phần cuối giải thích sự tò mò của bạn.",
      "Giải thích vai trò một loài trong hệ sinh thái hoặc giá trị bảo tồn; tránh lập luận chỉ dựa vào vẻ dễ thương.",
      "Chia trách nhiệm thường ngày và cam kết lâu dài; giải thích vì sao người nuôi cần chuẩn bị trước.",
      "Nêu một hoạt động học cụ thể rồi hành vi tôn trọng trẻ có thể rèn được.",
      "Định nghĩa không gian thân thiện với động vật rồi cân bằng với nhu cầu người sử dụng khác."
    ]
  },
  "Trang phục & Phong cách": {
    "words": [
      "comfortable fit — phom mặc thoải mái",
      "dress code — quy định trang phục",
      "traditional attire — trang phục truyền thống",
      "personal style — phong cách cá nhân",
      "fast fashion — thời trang nhanh",
      "long-lasting fabric — vải bền"
    ],
    "focus": [
      "Nêu trang phục thường ngày theo hoàn cảnh; “On a typical day, I wear…”.",
      "Nêu tiêu chí ưu tiên rồi ví dụ khi chấp nhận đánh đổi; “Comfort comes first, especially when…”.",
      "Đối chiếu một lựa chọn cũ/mới bằng “I used to… but now…” và lý do thay đổi.",
      "Nói cảm nhận rồi dịp bạn mặc hoặc nhìn thấy trang phục truyền thống; tránh trả lời chỉ yes/no.",
      "Mô tả món đồ từ tổng thể đến chi tiết; kể nguồn gốc bằng quá khứ và dịp sử dụng bằng hiện tại.",
      "Giải thích một chi tiết trang phục phản ánh văn hóa ra sao; phân biệt bản sắc với xu hướng ngắn hạn.",
      "Theo chuỗi sản xuất → sử dụng → thải bỏ để chọn một tác động; nêu cơ chế thay vì chỉ nói gây ô nhiễm.",
      "Nêu yếu tố làm xu hướng lan nhanh rồi cách người mua phản ứng; dùng “This encourages…” để nối ý.",
      "Tách nhu cầu an toàn/chuyên nghiệp khỏi sở thích thẩm mỹ; đưa điều kiện cho quy định linh hoạt."
    ]
  },
  "Nghệ thuật & Bảo tàng": {
    "words": [
      "art collection — bộ sưu tập nghệ thuật",
      "public artwork — tác phẩm ở nơi công cộng",
      "visual expression — cách biểu đạt bằng hình ảnh",
      "preserve heritage — bảo tồn di sản",
      "interactive exhibition — triển lãm tương tác",
      "artistic skills — kỹ năng nghệ thuật"
    ],
    "focus": [
      "Nêu mức độ thích tham quan và một loại hiện vật bạn chú ý; nếu ít đi, nói lần gần nhất.",
      "Dùng quá khứ đơn để kể môn mỹ thuật ở trường; thêm một bài tập hoặc kỹ năng còn nhớ.",
      "Nêu loại nghệ thuật rồi đặc điểm khiến bạn thích; “I’m drawn to… because…”.",
      "Trả lời có/không rồi vị trí một tác phẩm; nếu không nhớ tên hãy mô tả thay vì tự đặt tên.",
      "Mô tả tác phẩm đủ để người nghe hình dung; nối chi tiết quan sát với cảm xúc và suy nghĩ của bạn.",
      "Nêu mục tiêu chi ngân sách rồi lợi ích công chúng; đánh giá một giới hạn khi nguồn lực có hạn.",
      "Chọn tác động lên không gian hoặc con người rồi giải thích bằng một tình huống cụ thể.",
      "Nêu năng lực học nghệ thuật giúp hình thành và hoạt động tạo ra năng lực đó.",
      "So sánh một trải nghiệm trực tiếp và số; nói điều công nghệ mở rộng cùng điều khó thay thế."
    ]
  },
  "Hoạt động tình nguyện": {
    "words": [
      "give back to the community — đóng góp lại cho cộng đồng",
      "lend a hand — giúp một tay",
      "community service — hoạt động phục vụ cộng đồng",
      "raise awareness — nâng cao nhận thức",
      "build public trust — xây dựng niềm tin công chúng",
      "volunteer commitment — sự cam kết tình nguyện"
    ],
    "focus": [
      "Trả lời từng tham gia chưa rồi kể một việc bạn thực sự làm; phân biệt dự sự kiện với hỗ trợ tổ chức.",
      "Nêu hoạt động bạn quan sát được trong khu vực; dùng “As far as I know…” nếu thông tin có giới hạn.",
      "Chọn vấn đề xã hội bạn quan tâm và lý do cá nhân; không cần nói đã tình nguyện nếu chưa từng.",
      "Dùng “I’d like to…” cho mong muốn và điều kiện thời gian/kỹ năng để tham gia.",
      "Kể nhu cầu của người được giúp, hành động của bạn và kết quả; giải thích cảm xúc sau sự việc.",
      "Phân biệt động lực cá nhân và lợi ích cộng đồng; giải thích một động lực bằng ví dụ.",
      "Phân biệt khuyến khích với bắt buộc; nêu cách trường tổ chức để hoạt động có ý nghĩa.",
      "Liên kết minh bạch với niềm tin bằng một quy trình cụ thể; tránh chỉ yêu cầu tổ chức phải trung thực.",
      "Nêu rào cản tình nguyện viên gặp rồi hỗ trợ địa phương có thể cung cấp; giải thích hiệu quả."
    ]
  },
  "Học ngoại ngữ": {
    "words": [
      "language barrier — rào cản ngôn ngữ",
      "consistent practice — luyện tập đều đặn",
      "constructive feedback — phản hồi giúp tiến bộ",
      "native speaker — người bản ngữ",
      "communicate confidently — giao tiếp tự tin",
      "maintain motivation — duy trì động lực"
    ],
    "focus": [
      "Nêu ngôn ngữ muốn học rồi mục đích sử dụng; “Learning… would help me…”.",
      "Mô tả cách luyện nói cụ thể và tần suất; nói cách bạn biết mình tiến bộ.",
      "Chọn một khó khăn phát âm cụ thể rồi cách luyện; dùng “I find it hard to…” theo sau động từ.",
      "Dùng hiện tại hoàn thành để trả lời từng dùng app chưa; quá khứ đơn cho lần thử cụ thể.",
      "Kể kỹ năng ban đầu còn yếu, hoạt động học và thay đổi sau đó; dành trọng tâm cho điều khiến cách học hữu ích.",
      "Chọn lợi ích thực tế rồi cơ chế; đừng khẳng định học ngôn ngữ tự động bảo đảm việc làm.",
      "Nêu lợi thế bắt đầu sớm cùng điều kiện phương pháp phù hợp; phân biệt học qua chơi và áp lực thi cử.",
      "So sánh nhiệm vụ công nghệ làm tốt và nhiệm vụ cần giáo viên; giới hạn kết luận theo bối cảnh.",
      "Chỉ ra nguyên nhân mất động lực rồi một chiến lược xử lý; “Setting… can make progress more visible”."
    ]
  },
  "Không gian công cộng": {
    "words": [
      "public amenities — tiện ích công cộng",
      "accessible facilities — cơ sở dễ tiếp cận",
      "a gathering place — nơi tụ họp",
      "shared spaces — không gian dùng chung",
      "a welcoming atmosphere — bầu không khí thân thiện",
      "community hub — điểm sinh hoạt cộng đồng"
    ],
    "focus": [
      "Nêu vị trí thư viện gần nhất hoặc nói rõ không có; thêm cách bạn tiếp cận sách khi cần.",
      "Gọi tên nơi gặp gỡ phổ biến rồi giải thích vì sao phù hợp; phân biệt quan sát cộng đồng với sở thích riêng.",
      "Nêu tần suất tới công viên và hoạt động; dùng “I tend to go there when…”.",
      "Chọn một nơi và một điểm cần sửa; dùng “It would be better if…” để đề xuất cụ thể.",
      "Mô tả vị trí, người sử dụng và lúc đông; kể một lần quan sát cho thấy vai trò với cộng đồng.",
      "Định nghĩa sự thoải mái qua một nhu cầu sống rồi giải thích thiết kế đô thị đáp ứng nó.",
      "Nêu ai được lợi từ không gian miễn phí và vì sao việc miễn phí tạo khác biệt.",
      "Nêu vai trò thư viện ngoài cho mượn sách, rồi đánh giá nhu cầu đầu tư bằng một tiêu chí rõ.",
      "Chọn một rào cản tiếp cận và thiết kế khắc phục; nhớ tiếp cận có thể liên quan vận động, thông tin hoặc chi phí."
    ]
  },
  "Đồ vật kỷ niệm": {
    "words": [
      "sentimental value — giá trị tinh thần",
      "bring back memories — gợi lại kỷ niệm",
      "a keepsake — vật lưu niệm",
      "pass something down — truyền lại đồ vật",
      "digital archive — kho lưu trữ số",
      "a tangible reminder — vật gợi nhớ hữu hình"
    ],
    "focus": [
      "Nêu cách bạn giữ ảnh và lúc xem lại; “I keep… so that…” giải thích mục đích.",
      "Nêu món đã sở hữu lâu bằng “I’ve had… for…”; kể nguồn gốc bằng quá khứ đơn.",
      "So sánh hai loại quà qua nhu cầu người nhận; thêm ngoại lệ thay vì coi một loại luôn tốt hơn.",
      "Gọi tên vật gợi nhớ và ký ức nó khơi lại; dùng “It reminds me of…”.",
      "Mô tả vật đủ rõ, kể cách nhận được, nơi cất và ý nghĩa; dùng một ký ức để chứng minh giá trị.",
      "Phân biệt giá trị vật chất với ký ức; giải thích cách đồ vật kết nối người giữ với một giai đoạn.",
      "So sánh việc chụp/lưu/xem ảnh trước và nay theo một khía cạnh; thêm một tác động đến cách nhớ.",
      "Nêu đồ dùng thường ngày có thể kể gì về đời sống; đánh giá cách chọn hiện vật có giá trị đại diện.",
      "Đặt tiêu chí “valuable” trước khi so sánh; dùng “For someone who…, …may matter more”."
    ]
  },
  "Kỹ năng & Sáng tạo": {
    "words": [
      "learn by doing — học bằng thực hành",
      "trial and error — thử và sửa sai",
      "solve problems — giải quyết vấn đề",
      "creative thinking — tư duy sáng tạo",
      "practical experience — kinh nghiệm thực tế",
      "lifelong learning — học tập suốt đời"
    ],
    "focus": [
      "Nêu kỹ năng cụ thể và việc muốn làm tốt hơn; dùng “I’d like to get better at…”.",
      "Kể một thứ bạn làm hoặc muốn làm; mô tả cảm giác trong quá trình tạo ra nó.",
      "Mô tả cách học theo thứ tự quan sát → thử → sửa; “I usually start by…” theo sau V-ing.",
      "Dùng hiện tại hoàn thành để trả lời từng thử chưa, rồi quá khứ đơn cho trải nghiệm.",
      "Kể mục tiêu, cách luyện, lỗi gặp và cách sửa; chỉ ra việc hiện tại bạn làm được nhờ kỹ năng mới.",
      "Liên hệ kỹ năng thực hành với khả năng áp dụng kiến thức; đưa một tình huống học cụ thể.",
      "Nêu điều kiện làm việc khuyến khích sáng tạo rồi giải thích tác động; tránh chỉ yêu cầu nghĩ khác đi.",
      "So sánh trẻ và người lớn trên cùng tiêu chí học; thêm lợi thế của mỗi nhóm trước kết luận.",
      "Chỉ ra rào cản học của người lớn rồi cách cộng đồng hỗ trợ; nêu ai chịu trách nhiệm thực hiện."
    ]
  },
  "Nhà cửa & Trang trí": {
    "words": [
      "natural light — ánh sáng tự nhiên",
      "functional furniture — nội thất tiện dụng",
      "cosy atmosphere — không gian ấm cúng",
      "energy-efficient — tiết kiệm năng lượng",
      "living space — không gian sinh hoạt",
      "interior design — thiết kế nội thất"
    ],
    "focus": [
      "Gọi tên phòng rồi hoạt động khiến bạn thích ở đó; “It’s where I…” giúp gắn không gian với sinh hoạt.",
      "Nêu mức độ thích trang trí và một thay đổi nhỏ bạn từng làm; giải thích tác dụng.",
      "So sánh hai phong cách theo tính tiện dụng hoặc cảm giác; nêu lựa chọn cá nhân rõ.",
      "Nêu một thay đổi mong muốn bằng “I’d replace/add…” và kết quả bạn kỳ vọng.",
      "Dẫn người nghe từ vị trí vào bố cục phòng; chọn vài chi tiết liên quan trực tiếp cảm giác thoải mái.",
      "So sánh nhu cầu hai giai đoạn tuổi; giải thích nhu cầu đó dẫn tới lựa chọn nhà khác nhau.",
      "Liên kết cách bố trí với sinh hoạt hoặc cảm xúc; tránh chỉ nói mọi người muốn nhà đẹp.",
      "Nêu một thay đổi thiết kế rồi cách nó giảm tiêu thụ tài nguyên; cân nhắc khả năng áp dụng cho nhà có sẵn.",
      "Phân biệt nhỏ hơn và chật chội; đặt điều kiện về tiện ích và chất lượng trước khi đồng ý."
    ]
  },
  "Kỷ niệm tuổi thơ": {
    "words": [
      "childhood memories — ký ức tuổi thơ",
      "outdoor play — vui chơi ngoài trời",
      "carefree days — những ngày vô tư",
      "make-believe games — trò chơi tưởng tượng",
      "family bonding — sự gắn kết gia đình",
      "unstructured time — thời gian tự do không lên lịch"
    ],
    "focus": [
      "Nêu trò chơi từng thích bằng “I used to play…” và một luật hoặc cách chơi đơn giản.",
      "Nói tần suất hồi nhỏ và hoạt động ngoài trời; dùng quá khứ, tránh chuyển hết sang thói quen hiện tại.",
      "Đặt bối cảnh ký ức sớm nhất rồi kể một chi tiết bạn nhớ rõ; không cần chắc chắn về ngày tháng.",
      "Phân biệt việc vẫn ghé thăm hiện tại và cảm nhận về nơi đó; dùng “Whenever I go back…”.",
      "Kể một sự kiện tuổi thơ có đầu–giữa–cuối; thêm chi tiết cảm giác và lý do còn nhớ đến hôm nay.",
      "So sánh một mặt tuổi thơ giữa hai thời kỳ; tránh lãng mạn hóa quá khứ hoặc đánh đồng mọi trẻ.",
      "Giải thích một kỹ năng hình thành qua chơi và cách trò chơi tạo cơ hội luyện kỹ năng đó.",
      "Nêu hoạt động chung và cách gia đình tạo sự chú ý cho nhau; phân biệt tốn tiền với đáng nhớ.",
      "Định nghĩa thời gian rảnh thực sự rồi so sánh lịch học và quyền tự chọn hoạt động của trẻ."
    ]
  },
  "Kế hoạch & Mục tiêu": {
    "words": [
      "set realistic goals — đặt mục tiêu thực tế",
      "make steady progress — tiến bộ đều đặn",
      "stick to a plan — bám sát kế hoạch",
      "adjust priorities — điều chỉnh ưu tiên",
      "overcome setbacks — vượt qua trở ngại",
      "seize an opportunity — nắm bắt cơ hội"
    ],
    "focus": [
      "Nêu cách bạn lên kế hoạch và mức độ chi tiết; “I like to plan…, but I leave room for…”.",
      "Nêu một kết quả muốn đạt trong năm và bước kế tiếp; dùng “I’m hoping to…” thay vì kể nhiều mục tiêu.",
      "Nói công cụ lịch bạn dùng hoặc cách khác để nhớ việc; mô tả một mục bạn thường ghi.",
      "Nêu tần suất kế hoạch thay đổi và nguyên nhân điển hình; “When that happens, I…”.",
      "Kể mục tiêu, trở ngại và các bước đã làm bằng quá khứ; kết bằng kết quả thật và điều học được.",
      "Giải thích mục tiêu thay đổi quyết định hằng ngày ra sao; dùng một ví dụ để chứng minh lợi ích.",
      "Phân biệt định hướng sớm và chốt nghề quá sớm; nêu mức linh hoạt cần giữ.",
      "Mô tả trình tự đánh giá tình hình → đổi ưu tiên → hành động; giải thích một bước quan trọng.",
      "Định nghĩa thành công trong một bối cảnh rồi phân tích nỗ lực và cơ hội tương tác; tránh tỉ lệ tùy ý."
    ]
  }
};

  function normalise(value) {
    return String(value || '').replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function technique(question, part) {
    var q = normalise(question);
    if (part === 2) return [
      'Trong phút chuẩn bị, ghi từ khóa cho các gạch đầu dòng; nói thành mạch kể thay vì đọc từng mục.',
      'Mở bằng “I’d like to talk about…”; chuyển ý bằng “What stands out to me is…” và giải thích lý do ở đoạn cuối.',
      'Dùng quá khứ cho sự việc đã xảy ra, hiện tại cho đặc điểm còn đúng, “would” cho điều chưa trải nghiệm.',
      'Khi luyện 1–2 phút, mở rộng một chi tiết quan trọng bằng cảm giác hoặc kết quả; không học thuộc cả bài mẫu.'
    ];
    if (/advantages and disadvantages|pros and cons/.test(q)) return [
      'Dàn ý: lợi ích chính → lý do → hạn chế chính → điều kiện để lựa chọn hợp lý.',
      'Mở hai phía bằng “One advantage is…” và “A possible drawback is…”; giải thích mỗi phía thay vì chỉ gọi tên.',
      'Dùng “although” hoặc “while” để nối hai ý tương phản; kết luận không cần tuyệt đối.',
      'Chọn một tình huống minh họa cho sự đánh đổi; dùng “could” khi nói tác động chưa chắc chắn.'
    ];
    if (/changed|change.*over time|different when|since you|over the years|changed recently/.test(q)) return [
      'Dàn ý: tình hình trước đây → hiện tại → nguyên nhân thay đổi → cảm nhận hoặc hệ quả.',
      'Mở bằng “It has changed quite a bit…” hoặc “It hasn’t changed much…” theo điều bạn thực sự muốn nói.',
      'Dùng “used to” cho thói quen đã khác, “has/have changed” cho thay đổi kéo dài đến hiện tại.',
      part === 1 ? 'Chọn một thay đổi đủ rõ và thêm ví dụ cá nhân; không cần kể hết mọi giai đoạn.' : 'So sánh cùng một khía cạnh ở hai thời kỳ; dùng “in many cases” nếu nhận xét không đúng với tất cả.'
    ];
    if (/^should |should .*\?/.test(q)) return [
      'Dàn ý: quan điểm → lý do → cách thực hiện → một điều kiện hoặc hạn chế.',
      'Mở bằng “I think this would be worthwhile, provided that…” hoặc nêu lý do chưa đồng ý.',
      'Dùng “should” cho đề xuất và “could” cho lựa chọn; phân biệt đề xuất với quy định bắt buộc.',
      'Nêu ai cần hành động, làm gì và vì sao cách đó hiệu quả; không kết thúc ở lời kêu gọi chung.'
    ];
    if (/^why |why .*important|how important/.test(q)) return [
      'Dàn ý: nguyên nhân hoặc giá trị chính → giải thích cơ chế → một ví dụ phù hợp.',
      'Mở bằng “One reason is that…”; nối hệ quả bằng “which means…” hoặc “as a result”.',
      'Dùng hiện tại đơn cho nhận xét chung và “can” cho tác động có thể xảy ra.',
      part === 1 ? 'Giữ phần giải thích gắn với trải nghiệm hoặc quan sát của bạn.' : 'Nếu thêm nguyên nhân thứ hai, chọn nguyên nhân khác bản chất; tránh lặp ý bằng từ khác.'
    ];
    if (/^how can|^how should|^how do .*maintain|^how do .*deal/.test(q)) return [
      'Dàn ý: trở ngại → biện pháp cụ thể → cách biện pháp giải quyết trở ngại.',
      'Dùng “One practical approach would be to…” rồi nêu hành động, không chỉ mục tiêu.',
      'Cấu trúc “By + V-ing, … can…” giúp nối giải pháp với kết quả rõ ràng.',
      'Thêm một điều kiện thực hiện như thời gian, khả năng tiếp cận hoặc người chịu trách nhiệm.'
    ];
    if (/prefer|more important|more valuable|more about|easier .*child|comfort or style/.test(q)) {
      if (part === 3) return [
        'Dàn ý: nêu tiêu chí so sánh → giải thích mỗi phía theo cùng tiêu chí → kết luận có điều kiện.',
        'Mở bằng “I would argue that…” hoặc “It depends on…”; trả lời về hai đối tượng trong câu hỏi.',
        'Dùng “more/less…than”, “whereas” hoặc “compared with” để đối chiếu tác động; thêm một ví dụ cụ thể.',
        'Nêu nhóm người hoặc hoàn cảnh mà kết luận có thể khác; tránh biến nhận định chung thành sở thích cá nhân.'
      ];
      return [
      'Nêu lựa chọn hoặc tiêu chí so sánh ngay đầu; đừng dành toàn bộ câu trả lời mô tả hai phía.',
      'Dùng “I’d rather…” trước động từ hoặc “I prefer…” trước danh từ/V-ing; giữ hai vế cùng dạng.',
      'Đối chiếu bằng “whereas” hoặc “compared with”; chỉ so sánh một đến hai tiêu chí liên quan.',
      part === 1 ? 'Thêm một ngoại lệ ngắn bằng “unless…” nếu lựa chọn tùy hoàn cảnh.' : 'Nêu bối cảnh mà kết luận có thể khác; điều này giúp quan điểm cân bằng mà vẫn rõ.'
    ];
    }
    if (/would you|would .*like|future|will .*replace|might .*change|would .*learn/.test(q)) {
      if (part === 3) return [
        'Dàn ý: dự đoán chính → xu hướng hiện tại làm căn cứ → tác động có thể xảy ra → điều còn chưa chắc chắn.',
        'Mở bằng “It is likely that…” hoặc “One possible development is…” để nêu dự đoán trực tiếp.',
        'Dùng “may/might”, “is likely to” và “could” để thể hiện mức độ chắc chắn; thêm điều kiện bằng “if” hoặc “unless”.',
        'Phân biệt điều có khả năng xảy ra với điều bạn mong muốn; giải thích dự đoán ảnh hưởng đến ai và như thế nào.'
      ];
      return [
      'Dàn ý: mong muốn hoặc dự đoán → lý do → điều kiện để nó xảy ra.',
      'Dùng “I’d like to…” cho mong muốn cá nhân, “may” hoặc “is likely to” cho dự đoán.',
      'Nếu cần giả định, dùng “If…, …would/could…”; đừng kể điều chưa xảy ra như trải nghiệm thật.',
      part === 1 ? 'Nêu bước đầu tiên có thể làm để mong muốn cụ thể hơn.' : 'Nối dự đoán với một xu hướng hiện tại, rồi thừa nhận một điều còn chưa chắc chắn.'
    ];
    }
    if (/^did |^what was|^where did|as a child|when you were|earliest .*memory|buy recently/.test(q)) return [
      'Dàn ý: bối cảnh → một việc xảy ra → cảm nhận hoặc kết quả.',
      'Mở với “I remember…” hoặc trả lời trực tiếp thời điểm/nơi chốn được hỏi.',
      'Dùng quá khứ đơn cho sự kiện; dùng “used to” nếu đó là thói quen lặp lại.',
      'Chọn một chi tiết nhớ rõ; không cần bịa ngày tháng hoặc kéo sang chuyện không liên quan.'
    ];
    if (/^have you ever|^have you .*pet/.test(q)) return [
      'Trả lời “Yes, I have” hoặc “No, I haven’t” trước rồi bổ sung trải nghiệm hoặc lý do.',
      'Dùng hiện tại hoàn thành cho trải nghiệm tính đến nay; chuyển quá khứ đơn khi kể một lần cụ thể.',
      'Nếu đã từng, nối “The first/last time was…”; nếu chưa, có thể nói điều bạn muốn thử.',
      'Thêm một kết quả hoặc cảm nhận, không cần tạo câu chuyện để trả lời yes.'
    ];
    if (part === 3) return [
      'Nêu nhận định trực tiếp rồi giải thích cơ chế: điều gì dẫn đến điều gì, với nhóm người nào.',
      'Mở bằng “In many cases…” hoặc “I’d say…”; dùng “because” và “which can…” để phát triển lập luận.',
      'Dùng hiện tại đơn cho nhận xét chung; “can/tend to” giúp diễn đạt xu hướng mà không tuyệt đối hóa.',
      'Thêm ví dụ ngắn hoặc trường hợp ngoại lệ; không cần tự đặt số liệu để làm câu trả lời thuyết phục.'
    ];
    return [
      'Trả lời đúng điều được hỏi ở câu đầu, rồi nối một lý do và một chi tiết đời thường.',
      'Với thói quen dùng “I usually…”; với sở thích dùng “What I like about it is…”. Chọn khung khớp câu hỏi.',
      'Dùng hiện tại đơn cho sinh hoạt hiện tại; quá khứ đơn nếu thêm một lần trải nghiệm cụ thể.',
      'Tập nói vài câu liền mạch bằng ngôn ngữ của bạn; chọn một cụm từ phù hợp thay vì cố dùng hết danh sách.'
    ];
  }

  function forQuestion(question, topic, part) {
    var topics = global.BandRoomData && global.BandRoomData.TOPICS || [];
    var name = typeof topic === 'string' ? topic : topic && topic.name;
    if (typeof topic === 'number' && topics[topic]) name = topics[topic].name;
    var text = typeof question === 'object' && question ? question.title : question;
    var key = normalise(text);
    var selected = null;
    var index = -1;
    var actualPart = Number(part) || 1;
    for (var i = 0; i < topics.length; i++) {
      var candidate = topics[i];
      var questions = candidate.part1.concat([candidate.part2.title], candidate.part3);
      for (var j = 0; j < questions.length; j++) {
        if (normalise(questions[j]) === key) {
          selected = candidate;
          index = j;
          actualPart = j < 4 ? 1 : j === 4 ? 2 : 3;
          break;
        }
      }
      if (selected) break;
    }
    var profile = PROFILES[selected ? selected.name : name];
    var hints = technique(text, actualPart);
    if (profile && index >= 0) hints.unshift(profile.focus[index]);
    var words = profile ? profile.words.slice() : [
      'for instance — chẳng hạn', 'in my experience — theo trải nghiệm của tôi',
      'a key reason — một lý do chính', 'in contrast — trái lại',
      'as a result — vì vậy', 'to some extent — ở một mức độ nào đó'
    ];
    return { hints: hints, words: words };
  }
  global.BandRoomHints = { forQuestion: forQuestion };
})(window);
