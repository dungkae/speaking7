/* Ý tưởng nội dung theo từng câu hỏi. Đây là lựa chọn để gợi nhớ trải nghiệm,
   không phải đáp án mẫu hay khẳng định thay cho người học. */
(function (global) {
  'use strict';
  var byQuestion = {
  "Do you live in a house or an apartment?": [
    "Nhà riêng có sân nhỏ để trồng cây",
    "Căn hộ gần trường, tiện đi lại",
    "Sống cùng gia đình hay thuê với bạn",
    "Góc ban công hoặc phòng riêng bạn thích"
  ],
  "What do you like most about your hometown?": [
    "Hàng quán quen từ nhỏ",
    "Hàng xóm biết và giúp đỡ nhau",
    "Công viên, dòng sông hoặc món ăn địa phương",
    "Một nơi vẫn khiến bạn muốn quay về"
  ],
  "Has your hometown changed much since you were a child?": [
    "Đường đất đổi thành đường lớn",
    "Cửa hàng và chung cư xuất hiện",
    "Đi lại tiện hơn nhưng đông xe hơn",
    "Một địa điểm tuổi thơ còn giữ nguyên"
  ],
  "Would you like to live somewhere else in the future?": [
    "Thành phố có cơ hội học hoặc làm việc",
    "Nơi yên tĩnh để sống gần thiên nhiên",
    "Ở gần gia đình thay vì chuyển xa",
    "Chi phí thuê nhà ảnh hưởng quyết định"
  ],
  "Describe a place in your hometown that you enjoy visiting.": [
    "Công viên ven sông cách nhà vài phút",
    "Chiều cuối tuần đi dạo cùng người thân",
    "Một lần ngồi xem hoàng hôn sau kỳ thi",
    "Không khí mát và cảm giác quen thuộc khiến bạn quay lại"
  ],
  "Why do people move away from small towns to big cities?": [
    "Việc làm đa dạng và thu nhập kỳ vọng cao",
    "Đại học, bệnh viện tập trung ở đô thị",
    "Người trẻ muốn độc lập và thử môi trường mới",
    "Chi phí thuê nhà có thể khiến họ trở về"
  ],
  "What are the advantages and disadvantages of living in a big city?": [
    "Tiếp cận việc làm và dịch vụ dễ dàng",
    "Nhiều hoạt động văn hóa, gặp người mới",
    "Kẹt xe, tiếng ồn và giá thuê cao",
    "Người có con nhỏ có thể ưu tiên không gian yên tĩnh"
  ],
  "How might towns and cities change in the future?": [
    "Giao thông công cộng và khu đi bộ mở rộng",
    "Nhà ở tiết kiệm năng lượng",
    "Làm việc từ xa giảm nhu cầu sống ở trung tâm",
    "Nguy cơ giá nhà tăng khiến người thu nhập thấp ra ngoại ô"
  ],
  "Should governments invest more in rural areas or urban areas?": [
    "Nông thôn cần y tế, mạng và kết nối giao thông",
    "Đô thị cần xử lý quá tải và nhà ở",
    "Đầu tư theo mức thiếu dịch vụ thay vì dân số đơn thuần",
    "Liên kết thị trấn với thành phố có thể có lợi cho cả hai"
  ],
  "Do you work or are you a student?": [
    "Sinh viên đang học ngành mình quan tâm",
    "Người đi làm phụ trách một nhóm việc cụ thể",
    "Vừa học vừa làm thêm",
    "Một dự án hoặc môn học đang chiếm nhiều thời gian"
  ],
  "What do you like about your job or your studies?": [
    "Được giải quyết vấn đề thực tế",
    "Bạn học hoặc đồng nghiệp sẵn lòng hỗ trợ",
    "Tự do thử ý tưởng và nhìn thấy kết quả",
    "Môn khó nhưng khiến bạn tiến bộ rõ rệt"
  ],
  "What was your first day like?": [
    "Lo lắng vì không quen ai",
    "Đi nhầm phòng hoặc chưa hiểu quy trình",
    "Một người chủ động hướng dẫn bạn",
    "Cuối ngày thấy nhẹ nhõm và mong hôm sau"
  ],
  "What skills are important in your field?": [
    "Kiến thức chuyên môn để làm đúng việc",
    "Giao tiếp để giải thích ý tưởng",
    "Quản lý thời gian khi nhiều hạn nộp trùng nhau",
    "Tự học để theo kịp công cụ mới"
  ],
  "Describe a job you would like to have in the future.": [
    "Lập trình viên xây ứng dụng hỗ trợ học tập",
    "Cần nền tảng kỹ thuật và dự án thực hành",
    "Một ngày gồm viết mã, sửa lỗi và trao đổi với nhóm",
    "Hứng thú vì sản phẩm có thể giải quyết việc bạn từng gặp"
  ],
  "How has the nature of work changed in recent years?": [
    "Làm việc từ xa và lịch linh hoạt hơn",
    "Nhiều nghề dùng công cụ số hằng ngày",
    "Hợp đồng ngắn hạn tạo cơ hội nhưng kém ổn định",
    "Người lao động phải học thêm kỹ năng thường xuyên"
  ],
  "Do you think job satisfaction is more important than salary?": [
    "Lương đủ sống là nền tảng trước tiên",
    "Công việc có ý nghĩa giúp duy trì động lực",
    "Áp lực hoặc môi trường xấu có thể không đáng mức lương cao",
    "Ưu tiên thay đổi khi có người phụ thuộc"
  ],
  "What impact does technology have on the way people work?": [
    "Tự động hóa việc lặp lại tiết kiệm thời gian",
    "Họp trực tuyến giúp nhóm ở xa hợp tác",
    "Thông báo liên tục gây gián đoạn",
    "Đào tạo và quyền ngắt kết nối giúp giảm tác động xấu"
  ],
  "Should people change careers several times in their life?": [
    "Đổi nghề khi sở thích hoặc thị trường thay đổi",
    "Kinh nghiệm cũ có thể chuyển sang lĩnh vực mới",
    "Chi phí học lại và mất thu nhập là rào cản",
    "Thử dự án nhỏ trước khi bỏ công việc ổn định"
  ],
  "What do you usually do in your free time?": [
    "Đọc vài trang sách trước khi ngủ",
    "Chơi thể thao với bạn cuối tuần",
    "Nấu món mới hoặc chăm cây",
    "Chơi game có giới hạn để thư giãn"
  ],
  "Have your hobbies changed since you were a child?": [
    "Hồi nhỏ thích trò chạy nhảy ngoài sân",
    "Bây giờ chọn hoạt động phù hợp lịch học",
    "Một người bạn giới thiệu sở thích mới",
    "Vẫn giữ một thú vui từ tuổi thơ"
  ],
  "Do you prefer indoor or outdoor activities?": [
    "Trong nhà thoải mái khi trời nóng hoặc mưa",
    "Ngoài trời giúp vận động và gặp bạn",
    "Đi bộ một mình để đầu óc nhẹ hơn",
    "Chọn theo thời tiết và mức năng lượng hôm đó"
  ],
  "How important is it for people to have hobbies?": [
    "Có khoảng nghỉ sau học tập, công việc",
    "Có bạn bè cùng mối quan tâm",
    "Thấy tiến bộ qua một kỹ năng nhỏ",
    "Không cần sở thích đắt tiền hay thành tích"
  ],
  "Describe a hobby or activity you enjoy doing.": [
    "Chụp ảnh đường phố bằng điện thoại",
    "Bắt đầu từ một bức ảnh bạn tình cờ thích",
    "Cuối tuần tìm ánh sáng đẹp trong khu phố",
    "Một tấm ảnh đẹp khiến bạn để ý cuộc sống hơn"
  ],
  "Why do you think people's hobbies change as they get older?": [
    "Thời gian rảnh thay đổi khi đi làm hoặc có con",
    "Sức khỏe ảnh hưởng hoạt động có thể tham gia",
    "Thu nhập mở ra sở thích trước đây quá đắt",
    "Bạn bè và môi trường mới tạo hứng thú khác"
  ],
  "Do you think hobbies are more important now than in the past?": [
    "Áp lực và thời gian trước màn hình làm nhu cầu nghỉ tăng",
    "Cộng đồng trực tuyến giúp tìm người cùng sở thích",
    "Người trước đây cũng cần giải trí nhưng có cách khác",
    "Khó khẳng định một thời kỳ cần sở thích hơn tuyệt đối"
  ],
  "Should schools encourage students to have hobbies?": [
    "Câu lạc bộ giúp học sinh khám phá năng lực",
    "Hoạt động nghệ thuật hoặc thể thao tạo bạn bè",
    "Lịch quá dày có thể biến sở thích thành áp lực",
    "Cho học sinh tự chọn và hỗ trợ chi phí tham gia"
  ],
  "How do hobbies benefit mental health?": [
    "Hoạt động chú tâm giúp tạm rời lo lắng",
    "Vận động và gặp bạn có thể cải thiện tâm trạng",
    "Thành quả nhỏ đem lại cảm giác làm được việc",
    "Sở thích hỗ trợ tinh thần nhưng không thay thế chăm sóc chuyên môn"
  ],
  "What is your favourite food?": [
    "Một bát phở với nước dùng nóng",
    "Món mẹ hoặc bố thường nấu",
    "Đồ ăn cay hay món thanh nhẹ hợp khẩu vị",
    "Món gắn với bữa sáng hoặc một dịp đặc biệt"
  ],
  "Do you enjoy cooking?": [
    "Tự nấu để chọn nguyên liệu",
    "Thử món mới cuối tuần cùng gia đình",
    "Bận nên chỉ nấu món đơn giản",
    "Một lần nấu hỏng nhưng học được mẹo hữu ích"
  ],
  "What kind of restaurants do you like?": [
    "Quán gia đình có món quen và giá vừa phải",
    "Quán nhỏ yên tĩnh để trò chuyện",
    "Nơi sạch sẽ, phục vụ nhanh gần trường",
    "Sẵn lòng trả thêm cho nguyên liệu hoặc trải nghiệm tốt"
  ],
  "Has your diet changed over the years?": [
    "Ăn nhiều rau hơn trước",
    "Giảm nước ngọt vì muốn ngủ và học tốt hơn",
    "Tự nấu nhiều hơn khi sống xa nhà",
    "Lịch bận khiến giờ ăn thất thường"
  ],
  "Describe a meal you really enjoyed.": [
    "Bữa cơm đoàn tụ sau thời gian xa nhà",
    "Món canh hoặc món kho quen thuộc",
    "Cả nhà cùng chuẩn bị và kể chuyện",
    "Hương vị giản dị nhưng không khí khiến bữa ăn đáng nhớ"
  ],
  "How have eating habits changed in your country?": [
    "Đặt món qua ứng dụng thuận tiện hơn",
    "Bữa ăn gia đình khó sắp xếp khi lịch bận",
    "Nhiều người chú ý thành phần dinh dưỡng",
    "Thói quen khác nhau giữa thế hệ và khu vực"
  ],
  "What are the effects of fast food on health?": [
    "Ăn thường xuyên dễ dư năng lượng, muối hoặc đường",
    "Khẩu phần và cách chế biến quyết định mức ảnh hưởng",
    "Sự tiện lợi phù hợp một số ngày quá bận",
    "Thêm lựa chọn cân bằng thay vì cấm tuyệt đối"
  ],
  "Do you think traditional cooking skills are disappearing?": [
    "Người trẻ ít thời gian học món cầu kỳ",
    "Ông bà truyền công thức qua dịp lễ",
    "Video giúp lưu và chia sẻ kỹ thuật cũ",
    "Dạy nấu món địa phương có thể giữ truyền thống sống"
  ],
  "Should governments regulate unhealthy food advertising?": [
    "Trẻ em khó nhận ra mục đích quảng cáo",
    "Giới hạn quảng cáo trong nội dung dành cho trẻ",
    "Nhãn rõ thành phần giúp người lớn tự quyết định",
    "Cần phân biệt thông tin sản phẩm với tuyên bố gây hiểu nhầm"
  ],
  "What kind of technology do you use every day?": [
    "Điện thoại để liên lạc và xem lịch",
    "Máy tính để học, viết bài hoặc lập trình",
    "Tai nghe khi di chuyển",
    "Ứng dụng bản đồ giúp tránh đi nhầm"
  ],
  "Do you find it easy to learn new technology?": [
    "Dễ hơn khi giao diện quen thuộc",
    "Video hướng dẫn ngắn giúp bắt đầu",
    "Tính năng quá nhiều có thể gây rối",
    "Bạn thích thử trực tiếp hơn đọc hướng dẫn dài"
  ],
  "Was technology very different when you were a child?": [
    "Trước đây dùng máy tính chung của gia đình",
    "Internet chậm và ít thiết bị di động",
    "Bây giờ gọi video và lưu tài liệu tiện hơn",
    "Một thiết bị cũ vẫn gợi nhiều kỷ niệm"
  ],
  "What device could you not live without?": [
    "Điện thoại giúp liên lạc khi cần",
    "Laptop cần cho bài tập và dự án",
    "Tai nghe hỗ trợ tập trung nơi ồn",
    "Vẫn có thể xoay xở nhưng mất nhiều thời gian hơn"
  ],
  "Describe a piece of technology you find useful.": [
    "Laptop mua để học và làm dự án",
    "Dùng ghi chú, tra cứu và sửa bài mỗi ngày",
    "Một lần hoàn thành bài nhóm từ xa",
    "Tiện mang theo nhưng cần nhớ sao lưu dữ liệu"
  ],
  "How has technology changed the way people communicate?": [
    "Gọi video giúp gia đình ở xa gặp nhau",
    "Tin nhắn tạo phản hồi nhanh và ít tốn kém",
    "Thiếu giọng điệu dễ gây hiểu nhầm",
    "Gặp trực tiếp vẫn quan trọng trong chuyện nhạy cảm"
  ],
  "What are the disadvantages of relying too much on technology?": [
    "Mất kỹ năng tự xử lý khi thiết bị hỏng",
    "Khó tập trung vì thông báo",
    "Dữ liệu cá nhân có thể bị thu thập",
    "Duy trì phương án thủ công cho việc quan trọng"
  ],
  "Do you think technology will replace human jobs in the future?": [
    "Việc lặp lại dễ được tự động hóa",
    "Nghề cần đồng cảm và trách nhiệm vẫn cần người",
    "Công cụ mới cũng tạo nhiệm vụ và nghề mới",
    "Đào tạo lại giúp người lao động chuyển đổi"
  ],
  "How can people protect their privacy in the digital age?": [
    "Mật khẩu riêng và xác thực nhiều bước",
    "Xem quyền ứng dụng trước khi cấp",
    "Hạn chế công khai vị trí và giấy tờ",
    "Doanh nghiệp cũng phải giảm thu thập dữ liệu"
  ],
  "How often do you spend time with your family?": [
    "Ăn tối cùng gia đình hầu hết các ngày",
    "Gọi điện cuối tuần nếu sống xa",
    "Cùng nấu ăn hoặc đi chợ",
    "Lịch học bận nên ưu tiên khoảng thời gian ngắn có chất lượng"
  ],
  "Who do you usually ask for advice?": [
    "Cha mẹ khi cần góc nhìn lâu dài",
    "Bạn thân hiểu tình huống hiện tại",
    "Thầy cô về học tập và nghề nghiệp",
    "Nghe nhiều ý kiến rồi tự quyết định"
  ],
  "Do you prefer meeting friends in person or online?": [
    "Gặp trực tiếp dễ chia sẻ cảm xúc",
    "Nhắn tin thuận tiện khi ở xa",
    "Gọi video để giữ liên lạc giữa các lần gặp",
    "Chọn cách gặp theo nội dung muốn nói"
  ],
  "What makes a good friendship?": [
    "Biết lắng nghe mà không vội phán xét",
    "Giữ lời hứa và tôn trọng riêng tư",
    "Có thể bất đồng mà vẫn tôn trọng nhau",
    "Sẵn lòng giúp nhau trong lúc khó"
  ],
  "Describe a friend who has helped you.": [
    "Bạn cùng lớp quen qua bài tập nhóm",
    "Bạn ấy giúp ôn phần kiến thức bạn bị hổng",
    "Một buổi ngồi giải từng câu trước kỳ thi",
    "Bạn bớt lo và học được cách nhờ hỗ trợ"
  ],
  "How have family relationships changed in recent years?": [
    "Gia đình nhỏ phổ biến hơn ở đô thị",
    "Người trẻ sống xa nhà để học hoặc làm",
    "Công nghệ giúp liên lạc nhưng không thay thế thời gian bên nhau",
    "Vai trò chăm sóc có thể được chia sẻ bình đẳng hơn"
  ],
  "Why is friendship important at different ages?": [
    "Trẻ em học cách chơi và chia sẻ",
    "Thanh thiếu niên tìm cảm giác thuộc về",
    "Người lớn cần hỗ trợ giữa áp lực công việc",
    "Người cao tuổi có bạn để giảm cô đơn"
  ],
  "Can people maintain close friendships online?": [
    "Trò chuyện đều đặn giúp duy trì gắn bó",
    "Chơi hoặc học chung tạo trải nghiệm chung",
    "Tin nhắn ngắn có thể khiến hiểu lầm",
    "Sự tin cậy và nỗ lực quan trọng hơn nền tảng"
  ],
  "Should schools teach social skills?": [
    "Hoạt động nhóm tập lắng nghe và hợp tác",
    "Thảo luận tình huống giúp xử lý xung đột",
    "Giáo viên làm gương về cách tôn trọng khác biệt",
    "Gia đình cũng có vai trò, trường không thể làm một mình"
  ],
  "Do you enjoy travelling?": [
    "Đi xa để đổi không khí",
    "Thích khám phá món ăn địa phương",
    "Không thích lịch trình dày hoặc di chuyển lâu",
    "Một chuyến gần nhà cũng đủ vui"
  ],
  "Where did you go on your last holiday?": [
    "Chuyến biển cùng gia đình",
    "Đi về quê thăm người thân",
    "Một cuối tuần ở thành phố lân cận",
    "Kỳ nghỉ ở nhà nếu chưa đi đâu gần đây"
  ],
  "Do you prefer travelling alone or with others?": [
    "Đi một mình chủ động giờ giấc",
    "Đi với bạn có người chia sẻ và chia chi phí",
    "Đi cùng gia đình tạo kỷ niệm chung",
    "Chuyến dài cần thống nhất nhịp đi trước"
  ],
  "What kind of places would you like to visit?": [
    "Vùng núi có khí hậu mát",
    "Thành phố có bảo tàng và phố cổ",
    "Làng nhỏ để trải nghiệm đời sống địa phương",
    "Điểm đến phù hợp ngân sách và thời gian"
  ],
  "Describe a memorable trip you took.": [
    "Chuyến lên Đà Lạt với nhóm bạn",
    "Mưa làm nhóm đổi kế hoạch đi bộ sang quán nhỏ",
    "Một cuộc trò chuyện dài giữa lúc trú mưa",
    "Kỷ niệm nằm ở người đi cùng hơn số nơi đã đến"
  ],
  "How does tourism benefit local communities?": [
    "Khách tạo việc làm cho quán ăn, hướng dẫn viên",
    "Sản phẩm thủ công có thêm thị trường",
    "Nguồn thu có thể hỗ trợ hạ tầng địa phương",
    "Lợi ích giảm nếu phần lớn tiền về công ty bên ngoài"
  ],
  "What problems can too many tourists cause?": [
    "Rác thải và quá tải nước, giao thông",
    "Giá nhà tăng khiến cư dân khó ở lại",
    "Địa điểm tự nhiên bị xói mòn",
    "Giới hạn lượng khách cần đi cùng sinh kế thay thế"
  ],
  "How might travel change in the future?": [
    "Đặt chuyến và dịch thuật thuận tiện hơn",
    "Khách có thể chọn chuyến gần để giảm chi phí",
    "Giao thông ít phát thải được quan tâm",
    "Chi phí và hạ tầng quyết định tốc độ thay đổi"
  ],
  "Should governments promote domestic tourism?": [
    "Du lịch nội địa giúp vùng ít nổi tiếng có thu nhập",
    "Người dân hiểu văn hóa trong nước hơn",
    "Cần đảm bảo giá và giao thông thuận tiện",
    "Quảng bá phải đi cùng bảo vệ điểm đến"
  ],
  "What kind of music do you listen to?": [
    "Nhạc pop dễ nghe khi đi đường",
    "Nhạc không lời khi cần tập trung",
    "Bài hát cũ gắn với gia đình",
    "Thể loại thay đổi theo tâm trạng"
  ],
  "When do you usually listen to music?": [
    "Buổi sáng trên đường đến trường",
    "Khi dọn phòng hoặc tập thể dục",
    "Buổi tối để thư giãn",
    "Tắt nhạc khi làm việc cần tập trung cao"
  ],
  "Did you learn a musical instrument as a child?": [
    "Từng học đàn ở lớp ngoại khóa",
    "Tự tập vài hợp âm qua video",
    "Không học nhưng từng muốn thử piano",
    "Bỏ dở vì thiếu thời gian hoặc chỗ luyện"
  ],
  "Do you prefer live music or recordings?": [
    "Nhạc sống có cảm giác cùng đám đông",
    "Bản thu rõ tiếng và nghe bất cứ lúc nào",
    "Vé diễn và khoảng cách là rào cản",
    "Chọn nhạc sống cho nghệ sĩ mình rất thích"
  ],
  "Describe a song or piece of music you remember well.": [
    "Bài hát nghe trong lễ chia tay lớp",
    "Một người bạn bật nó lúc mọi người chụp ảnh",
    "Giai điệu gợi cảm giác vui xen tiếc nuối",
    "Nghe lại là nhớ ngay ngày hôm đó"
  ],
  "Why is music important in different cultures?": [
    "Bài hát lưu ngôn ngữ và câu chuyện cộng đồng",
    "Âm nhạc gắn với lễ hội và nghi thức",
    "Người trẻ pha trộn truyền thống với thể loại mới",
    "Cùng một bài có thể mang ý nghĩa khác giữa thế hệ"
  ],
  "How has technology changed the music industry?": [
    "Nghệ sĩ độc lập dễ phát hành tác phẩm",
    "Người nghe khám phá nhạc qua nền tảng số",
    "Thu nhập mỗi lượt nghe có thể thấp",
    "Thuật toán vừa mở cơ hội vừa ưu tiên bài dễ lan truyền"
  ],
  "Should children learn to play an instrument?": [
    "Tập đàn rèn kiên nhẫn và nghe nhịp",
    "Chơi cùng nhóm giúp hợp tác",
    "Học phí và nhạc cụ có thể tạo bất bình đẳng",
    "Nên cho thử và lựa chọn thay vì ép học lâu dài"
  ],
  "What makes live performances appealing?": [
    "Người nghe cùng hát tạo cảm giác kết nối",
    "Biểu diễn có biến tấu không có trong bản thu",
    "Ánh sáng và không gian tăng cảm xúc",
    "Chất lượng âm thanh và giá vé ảnh hưởng trải nghiệm"
  ],
  "What kinds of films do you enjoy?": [
    "Phim hài để thư giãn",
    "Phim trinh thám vì thích đoán diễn biến",
    "Phim đời thường có nhân vật gần gũi",
    "Chọn theo tâm trạng hơn thể loại cố định"
  ],
  "Do you prefer watching films at home or in a cinema?": [
    "Ở nhà chủ động dừng và tiết kiệm tiền",
    "Rạp có màn hình và âm thanh lớn",
    "Phim nhiều cảnh hành động hợp xem rạp",
    "Phim nhẹ nhàng hợp tối xem tại nhà"
  ],
  "Who do you usually watch films with?": [
    "Bạn thân có gu phim giống nhau",
    "Gia đình trong cuối tuần",
    "Xem một mình để tập trung",
    "Thích trao đổi về đoạn kết sau khi xem"
  ],
  "Have your viewing habits changed recently?": [
    "Xem theo yêu cầu thay lịch truyền hình",
    "Ít thời gian nên chọn phim ngắn hơn",
    "Dễ xem liên tiếp quá nhiều tập",
    "Chủ động tắt tự phát để ngủ đúng giờ"
  ],
  "Describe a film that made you think.": [
    "Một phim về người phải chọn giữa gia đình và sự nghiệp",
    "Xem cùng bạn vào cuối tuần",
    "Cảnh nhân vật từ bỏ cơ hội khiến bạn bất ngờ",
    "Bạn nghĩ lại về cách đánh giá thành công"
  ],
  "Can films influence people’s behaviour?": [
    "Nhân vật có thể trở thành hình mẫu",
    "Câu chuyện khơi gợi sự đồng cảm",
    "Khán giả còn chịu ảnh hưởng từ gia đình và trải nghiệm",
    "Không nên coi một bộ phim là nguyên nhân duy nhất"
  ],
  "Should films reflect real social issues?": [
    "Phim giúp vấn đề khó trở nên gần gũi",
    "Tiếng nói nhóm ít được chú ý có thể được nghe",
    "Câu chuyện cần tránh đơn giản hóa người thật",
    "Phim giải trí cũng có giá trị mà không cần thông điệp xã hội"
  ],
  "How have streaming services changed entertainment?": [
    "Xem linh hoạt trên nhiều thiết bị",
    "Tác phẩm quốc tế dễ tiếp cận hơn",
    "Quá nhiều lựa chọn và gói thuê bao gây mệt",
    "Rạp phải tạo trải nghiệm đáng ra ngoài"
  ],
  "What is the value of local film industries?": [
    "Giữ ngôn ngữ và câu chuyện địa phương",
    "Tạo việc làm cho người sáng tạo",
    "Khán giả thấy đời sống của mình trên màn ảnh",
    "Hỗ trợ chất lượng và đào tạo hơn chạy theo số lượng"
  ],
  "Do you enjoy reading?": [
    "Đọc để thư giãn trước khi ngủ",
    "Đọc bài ngắn khi không đủ thời gian cho sách dài",
    "Thích đọc về điều đang tò mò",
    "Khó duy trì vì điện thoại dễ gây phân tâm"
  ],
  "What kinds of books do you prefer?": [
    "Truyện trinh thám để theo dấu manh mối",
    "Tiểu sử để hiểu lựa chọn của người khác",
    "Sách khoa học dễ hiểu",
    "Truyện ngắn hợp các khoảng nghỉ"
  ],
  "Did someone read to you when you were younger?": [
    "Cha mẹ đọc truyện trước giờ ngủ",
    "Ông bà kể chuyện thay vì đọc sách",
    "Giáo viên đọc truyện trong lớp",
    "Tự xem tranh rồi mới thích đọc chữ"
  ],
  "Do you prefer printed books or e-books?": [
    "Sách giấy dễ ghi chú và ít xao nhãng",
    "Sách điện tử nhẹ, mang theo nhiều cuốn",
    "Có thể tăng cỡ chữ trên thiết bị",
    "Giá và khả năng mượn ảnh hưởng lựa chọn"
  ],
  "Describe a book you would recommend.": [
    "Một cuốn truyện về tình bạn bạn mượn từ thư viện",
    "Bạn chọn vì lời giới thiệu của bạn cùng lớp",
    "Một nhân vật học cách lắng nghe người khác",
    "Cuốn sách dễ đọc và khiến bạn quan tâm hơn đến bạn bè"
  ],
  "How can schools encourage reading?": [
    "Cho học sinh tự chọn sách theo sở thích",
    "Có giờ đọc yên tĩnh và thư viện dễ mượn",
    "Trao đổi về truyện thay vì chỉ kiểm tra nội dung",
    "Sách âm thanh hoặc sách dễ đọc giúp nhiều người tham gia"
  ],
  "Will digital media replace printed books?": [
    "Sách số tiện tìm kiếm và cập nhật",
    "Sách giấy có cảm giác cầm đọc và không cần pin",
    "Chi phí thiết bị và thói quen giữ cả hai tồn tại",
    "Tài liệu tham khảo có thể số hóa nhanh hơn sách quà tặng"
  ],
  "Why do people read different genres?": [
    "Có người tìm giải trí, có người tìm kiến thức",
    "Tâm trạng khiến người đọc đổi thể loại",
    "Trải nghiệm sống làm một chủ đề trở nên gần gũi",
    "Giới thiệu từ bạn bè mở rộng gu đọc"
  ],
  "How does reading affect imagination?": [
    "Người đọc tự dựng hình ảnh nhân vật",
    "Thế giới xa lạ khơi gợi câu hỏi mới",
    "Góc nhìn khác giúp tưởng tượng hoàn cảnh người khác",
    "Mức tác động tùy cách đọc và nội dung"
  ],
  "Do you enjoy playing sports?": [
    "Cầu lông với bạn sau giờ học",
    "Chạy bộ để dễ sắp lịch",
    "Thích xem hơn chơi vì chưa tìm được nhóm",
    "Thử vận động nhẹ trước khi tập nghiêm túc"
  ],
  "What sport is popular where you live?": [
    "Bóng đá ở sân nhỏ gần nhà",
    "Cầu lông trong khu dân cư",
    "Chạy bộ ở công viên",
    "Sân miễn phí khiến một môn dễ phổ biến"
  ],
  "Did you play sports at school?": [
    "Chơi bóng trong giờ thể dục",
    "Thi đấu lớp với lớp",
    "Một giáo viên giúp bạn tự tin hơn",
    "Không giỏi thi đấu nhưng thích vận động cùng bạn"
  ],
  "Do you prefer team or individual activities?": [
    "Môn nhóm có động lực và bạn đồng hành",
    "Môn cá nhân dễ điều chỉnh lịch",
    "Không thích phụ thuộc đủ số người",
    "Chọn tùy mục tiêu giao lưu hay rèn sức bền"
  ],
  "Describe a sport you would like to try.": [
    "Muốn thử bơi ở hồ gần nhà",
    "Đi cùng người bạn biết bơi hoặc học huấn luyện viên",
    "Ban đầu lo xuống nước sâu",
    "Mong tự tin hơn và có hoạt động ít áp lực lên khớp"
  ],
  "Why do communities invest in sports facilities?": [
    "Sân gần nhà giúp mọi người vận động dễ hơn",
    "Không gian gặp gỡ tăng kết nối cộng đồng",
    "Trẻ em có nơi chơi an toàn",
    "Cần bảo trì và mức phí phù hợp để sân được dùng thật"
  ],
  "What are the benefits of team sports?": [
    "Học phối hợp và chia sẻ trách nhiệm",
    "Đồng đội khuyến khích duy trì luyện tập",
    "Thua trận giúp học kiểm soát cảm xúc",
    "Cạnh tranh quá mức có thể làm người mới ngại tham gia"
  ],
  "Should schools focus more on physical education?": [
    "Giờ vận động tạo khoảng nghỉ sau học lý thuyết",
    "Trẻ có cơ hội thử nhiều môn",
    "Cần đa dạng hoạt động cho năng lực khác nhau",
    "Tăng chất lượng và niềm vui hơn chỉ tăng thi đấu"
  ],
  "How has technology influenced professional sports?": [
    "Cảm biến giúp theo dõi tải tập",
    "Video hỗ trợ phân tích chiến thuật",
    "Công nghệ trọng tài giảm một số sai sót",
    "Chi phí cao tạo khoảng cách giữa các đội"
  ],
  "Do you like spending time outdoors?": [
    "Đi bộ ở công viên sau giờ học",
    "Đi dã ngoại khi có thời gian",
    "Thích bóng cây và không khí buổi sáng",
    "Trời quá nóng khiến bạn ưu tiên giờ mát"
  ],
  "Is there a park near your home?": [
    "Công viên cách nhà mười phút đi bộ",
    "Có đường chạy và ghế nghỉ",
    "Đông người vào buổi chiều",
    "Thiếu cây hoặc đèn là điều bạn muốn cải thiện"
  ],
  "What environmental issues concern people in your area?": [
    "Rác ở kênh hoặc ven đường",
    "Khói bụi khi giao thông đông",
    "Tiếng ồn gần khu dân cư",
    "Thiếu bóng cây vào mùa nóng"
  ],
  "Do you try to reduce waste?": [
    "Mang bình nước dùng lại",
    "Mua vừa đủ để bớt bỏ thức ăn",
    "Sửa đồ trước khi thay mới",
    "Phân loại rác nếu nơi ở có hệ thống thu gom"
  ],
  "Describe a natural place you would like to visit.": [
    "Muốn đi một vườn quốc gia có rừng và thác",
    "Hình ảnh đường mòn xanh khiến bạn chú ý",
    "Đi bộ cùng hướng dẫn viên và quan sát chim",
    "Muốn trải nghiệm yên tĩnh và hiểu môi trường sống tự nhiên"
  ],
  "How can cities protect green spaces?": [
    "Bảo vệ đất công viên khỏi xây dựng tùy tiện",
    "Trồng cây phù hợp khí hậu địa phương",
    "Kết nối mảng xanh thành đường đi bộ",
    "Bảo trì lâu dài quan trọng như trồng mới"
  ],
  "What can individuals do to reduce pollution?": [
    "Đi chung xe hoặc dùng phương tiện công cộng",
    "Giảm đốt rác và dùng đồ một lần",
    "Báo điểm xả thải hoặc tham gia dọn khu phố",
    "Hành động cá nhân cần hạ tầng và chính sách hỗ trợ"
  ],
  "Should businesses be responsible for environmental impacts?": [
    "Doanh nghiệp kiểm soát thiết kế và quy trình sản xuất",
    "Chi phí xử lý không nên đẩy hết sang cộng đồng",
    "Quy định rõ giúp cạnh tranh công bằng",
    "Hỗ trợ chuyển đổi cho doanh nghiệp nhỏ kèm trách nhiệm đo lường"
  ],
  "How can people learn about biodiversity?": [
    "Quan sát cây và chim ngay trong khu phố",
    "Tham gia hoạt động của bảo tàng hoặc khu bảo tồn",
    "Trường cho học sinh tìm hiểu hệ sinh thái gần mình",
    "Phân biệt nguồn khoa học với nội dung giật gân"
  ],
  "What was your favourite subject at school?": [
    "Thích toán vì có cảm giác giải được vấn đề",
    "Thích văn vì được bàn về con người",
    "Môn khoa học có thí nghiệm thú vị",
    "Giáo viên nhiệt tình khiến bạn yêu một môn"
  ],
  "How do you prefer to study?": [
    "Tự học nơi yên tĩnh trước khi hỏi người khác",
    "Làm bài tập thay vì chỉ đọc lại",
    "Chia nội dung thành buổi ngắn",
    "Ghi chú bằng ví dụ dễ nhớ"
  ],
  "Do you enjoy learning with classmates?": [
    "Bạn giải thích được phần mình chưa hiểu",
    "Thảo luận giúp nhìn ra lỗi",
    "Nhóm đông dễ chuyển sang trò chuyện",
    "Học một mình trước rồi cùng chữa bài"
  ],
  "What would you like to learn next?": [
    "Một ngoại ngữ để đi du lịch",
    "Kỹ năng lập trình làm dự án nhỏ",
    "Nấu ăn để tự chăm sóc bản thân",
    "Thuyết trình để tự tin hơn"
  ],
  "Describe a teacher who helped you learn something.": [
    "Thầy cô giúp bạn vượt qua phần toán khó",
    "Thay công thức khô khan bằng ví dụ mua bán",
    "Bạn được thử lại sau khi làm sai",
    "Từ sợ môn học sang dám đặt câu hỏi"
  ],
  "How should schools prepare students for the future?": [
    "Dạy tư duy phản biện và kiểm chứng thông tin",
    "Cho làm dự án và hợp tác",
    "Kỹ năng số đi cùng đạo đức và trách nhiệm",
    "Kiến thức nền vẫn cần để hiểu công cụ mới"
  ],
  "What are the benefits of online learning?": [
    "Học từ xa giảm chi phí đi lại",
    "Có thể xem lại bài giảng theo tốc độ riêng",
    "Người ở xa tiếp cận khóa học đa dạng",
    "Thiếu thiết bị và khó tập trung là giới hạn"
  ],
  "Are exams the best way to assess knowledge?": [
    "Bài thi kiểm tra cùng điều kiện tương đối rõ",
    "Áp lực có thể che khuất năng lực thật",
    "Dự án cho thấy cách áp dụng kiến thức",
    "Kết hợp thi, thực hành và phản hồi sẽ đầy đủ hơn"
  ],
  "How can education become more accessible?": [
    "Học phí và thiết bị phù hợp khả năng chi trả",
    "Tài liệu dễ tiếp cận cho người khuyết tật",
    "Lớp linh hoạt cho người đi làm",
    "Hỗ trợ giáo viên và mạng ở vùng xa"
  ],
  "What festivals do you celebrate?": [
    "Tết để gặp gia đình",
    "Trung thu với hoạt động cho trẻ",
    "Một lễ hội địa phương gần nhà",
    "Có thể tham gia dù không tổ chức lớn"
  ],
  "Do you enjoy traditional celebrations?": [
    "Thích không khí cả nhà chuẩn bị",
    "Món truyền thống gợi ký ức",
    "Đông đúc hoặc nghi thức dài khiến bạn mệt",
    "Thích giữ phần có ý nghĩa với gia đình"
  ],
  "What do you usually do on special occasions?": [
    "Ăn cùng người thân và chụp ảnh",
    "Chuẩn bị quà nhỏ hoặc lời chúc",
    "Giúp dọn nhà và nấu ăn",
    "Gọi điện cho người không thể về"
  ],
  "Have local traditions changed over time?": [
    "Một số nghi thức được làm gọn",
    "Lời chúc qua mạng phổ biến hơn",
    "Đồ ăn truyền thống vẫn được giữ",
    "Người trẻ kết hợp cách tổ chức mới với phong tục cũ"
  ],
  "Describe a celebration you enjoyed.": [
    "Tết khi người thân lâu ngày về đông đủ",
    "Cả nhà gói bánh hoặc chuẩn bị bữa cơm",
    "Một người kể chuyện cũ khiến mọi người cười",
    "Cảm giác thuộc về gia đình làm dịp đó đặc biệt"
  ],
  "Why is it important to preserve traditions?": [
    "Phong tục giúp nối các thế hệ",
    "Nghề thủ công và ký ức địa phương được giữ",
    "Truyền thống có thể thay đổi để phù hợp hiện tại",
    "Không cần giữ tập tục gây hại chỉ vì lâu đời"
  ],
  "How does tourism influence cultural festivals?": [
    "Du khách tạo thu nhập cho người tổ chức",
    "Sự chú ý giúp phục hồi hoạt động cũ",
    "Thương mại hóa có thể làm lễ hội mất ý nghĩa",
    "Cộng đồng địa phương nên tham gia quyết định"
  ],
  "Are young people interested in traditional customs?": [
    "Có người quan tâm qua âm nhạc, thời trang, món ăn",
    "Lịch bận hoặc cách truyền đạt khô khan làm họ xa cách",
    "Tham gia thực tế thường hấp dẫn hơn nghe giảng",
    "Không nên xem người trẻ là một nhóm có cùng thái độ"
  ],
  "How can celebrations bring communities together?": [
    "Chuẩn bị chung tạo dịp hợp tác",
    "Người mới đến có cơ hội làm quen",
    "Không gian miễn phí giúp nhiều nhóm tham gia",
    "Tôn trọng khác biệt để không ai bị loại khỏi lễ hội"
  ],
  "Do you enjoy shopping?": [
    "Thích tìm sách hoặc đồ dùng có ích",
    "Chỉ mua khi thực sự cần",
    "Đi cùng bạn để tham khảo lựa chọn",
    "Cửa hàng đông khiến bạn nhanh mệt"
  ],
  "Do you usually shop online or in stores?": [
    "Online thuận tiện và dễ so giá",
    "Ra cửa hàng để thử kích cỡ",
    "Đồ đắt tiền cần kiểm tra trực tiếp",
    "Phí giao hàng và đổi trả ảnh hưởng quyết định"
  ],
  "What did you buy recently?": [
    "Bình nước dùng đi học",
    "Tai nghe thay chiếc bị hỏng",
    "Một cuốn sách đang muốn đọc",
    "Chọn vì dùng thường xuyên hơn vì giảm giá"
  ],
  "Do you compare prices before purchasing things?": [
    "So vài cửa hàng trước món đắt tiền",
    "Tính cả phí giao và bảo hành",
    "Đọc đánh giá về độ bền",
    "Không dành quá nhiều thời gian so món giá nhỏ"
  ],
  "Describe something useful that you bought.": [
    "Chiếc đèn bàn dùng học buổi tối",
    "Mua sau khi đèn cũ chập chờn",
    "Ánh sáng điều chỉnh được, bàn đỡ chật",
    "Dùng mỗi ngày nên thấy đáng tiền hơn một món trang trí"
  ],
  "How has online shopping affected local stores?": [
    "Khách có thể so giá nên cửa hàng chịu áp lực",
    "Cửa hàng nhỏ bán qua mạng để mở rộng khách",
    "Tư vấn và thử hàng vẫn là lợi thế trực tiếp",
    "Tiền thuê mặt bằng khiến cạnh tranh không đồng đều"
  ],
  "Why do people buy things they do not need?": [
    "Giảm giá tạo cảm giác sợ bỏ lỡ",
    "Mua để cải thiện tâm trạng",
    "Ảnh hưởng từ bạn bè hoặc người nổi tiếng",
    "Chờ một ngày trước khi mua giúp nhận ra nhu cầu thật"
  ],
  "Should advertising aimed at children be limited?": [
    "Trẻ khó phân biệt quảng cáo với giải trí",
    "Quảng cáo có thể gây áp lực đòi mua",
    "Giới hạn nhắm mục tiêu và công khai tài trợ",
    "Phụ huynh cần công cụ hỗ trợ chứ không gánh hết trách nhiệm"
  ],
  "How can people shop more sustainably?": [
    "Mua đồ bền và dễ sửa",
    "Chọn đồ cũ khi phù hợp",
    "Mượn đồ ít dùng thay vì sở hữu",
    "Thông tin minh bạch giúp tránh quảng cáo xanh thiếu căn cứ"
  ],
  "How do you usually travel around your city?": [
    "Xe buýt cho tuyến đi học cố định",
    "Xe máy tiện các chuyến ngắn",
    "Đi bộ khi nơi đến gần",
    "Kết hợp phương tiện tùy thời tiết và giờ cao điểm"
  ],
  "Do you use public transport?": [
    "Xe buýt tiết kiệm hơn đi riêng",
    "Tuyến tàu tiện nếu ga gần nhà",
    "Ít dùng vì phải đổi chuyến lâu",
    "Muốn dùng thường hơn nếu giờ chạy đáng tin cậy"
  ],
  "What is the busiest road near you?": [
    "Đường gần trường đông vào giờ tan học",
    "Ngã tư có nhiều xe rẽ",
    "Xe buýt và hàng quán khiến đường chật",
    "Bạn tránh bằng tuyến phụ hoặc đi sớm"
  ],
  "Would you like to cycle more often?": [
    "Đạp xe cho quãng ngắn để vận động",
    "Lo xe lớn và thiếu làn riêng",
    "Trời nóng làm đi học bằng xe đạp khó hơn",
    "Có chỗ gửi và tắm thay đồ sẽ thuận tiện"
  ],
  "Describe a journey you take regularly.": [
    "Đường từ nhà đến trường mỗi sáng",
    "Đi xe buýt khoảng nửa giờ rồi đi bộ",
    "Nhìn các quán mở cửa trên đường",
    "Thích thời gian đọc sách nhưng ngại lúc xe quá đông"
  ],
  "How can public transport be improved?": [
    "Tăng độ đúng giờ và thông tin chuyến",
    "Kết nối tuyến để ít chờ đổi xe",
    "Vé dễ mua, giá phù hợp",
    "Điểm dừng có mái che và tiếp cận cho xe lăn"
  ],
  "Why do cities experience traffic congestion?": [
    "Quá nhiều xe cá nhân trong giờ cố định",
    "Nhà ở xa nơi làm việc",
    "Giao lộ và chỗ đỗ tổ chức chưa tốt",
    "Phương tiện công cộng chưa hấp dẫn để chuyển sang"
  ],
  "What are the pros and cons of electric vehicles?": [
    "Xe điện giảm khí thải tại nơi sử dụng",
    "Chi phí sử dụng có thể thấp hơn tùy giá điện",
    "Sản xuất pin và nguồn điện vẫn có tác động",
    "Trạm sạc và giá mua là rào cản"
  ],
  "Should cities create more space for pedestrians?": [
    "Vỉa hè an toàn hỗ trợ người già và trẻ em",
    "Khu đi bộ có thể tăng khách cho cửa hàng",
    "Cần phương án giao hàng và tiếp cận cho người khó di chuyển",
    "Thử nghiệm từng khu rồi đo tác động"
  ],
  "What do you do to stay healthy?": [
    "Đi bộ đều sau bữa tối",
    "Ăn đủ bữa và uống nước",
    "Ngủ theo giờ tương đối ổn định",
    "Chọn thói quen vừa sức để duy trì lâu"
  ],
  "Do you get enough sleep?": [
    "Ngủ đủ khi không có hạn nộp gần",
    "Điện thoại khiến ngủ muộn",
    "Tạo giờ tắt màn hình trước khi ngủ",
    "Cảm thấy tập trung hơn sau đêm ngủ tốt"
  ],
  "What helps you relax after a busy day?": [
    "Đi dạo không cầm điện thoại",
    "Nghe nhạc nhẹ hoặc tắm nước ấm",
    "Nói chuyện với người thân",
    "Làm một việc đơn giản như chăm cây"
  ],
  "Have your daily habits changed recently?": [
    "Đi ngủ sớm hơn trước",
    "Chuẩn bị bữa sáng thay vì bỏ bữa",
    "Đi bộ thay một chuyến xe ngắn",
    "Thói quen thay đổi khi lịch học hoặc làm thay đổi"
  ],
  "Describe a healthy habit you have developed.": [
    "Bắt đầu đi bộ hai mươi phút sau giờ học",
    "Rủ bạn cùng đi để dễ duy trì",
    "Ngày mưa vận động nhẹ trong nhà",
    "Cảm thấy tỉnh táo hơn và có khoảng nghỉ rõ ràng"
  ],
  "How can governments encourage healthier lifestyles?": [
    "Công viên và đường đi bộ an toàn",
    "Bữa ăn lành mạnh dễ mua với giá hợp lý",
    "Thông tin sức khỏe dễ hiểu",
    "Chính sách giờ làm cũng ảnh hưởng khả năng chăm sóc bản thân"
  ],
  "Why is maintaining healthy habits difficult?": [
    "Lịch bận làm người ta ưu tiên việc gấp",
    "Thói quen cũ gắn với môi trường và bạn bè",
    "Mục tiêu quá lớn dễ gây bỏ cuộc",
    "Bắt đầu nhỏ và điều chỉnh môi trường giúp bền hơn"
  ],
  "What role do schools play in health education?": [
    "Dạy đọc nhãn thực phẩm và hiểu giấc ngủ",
    "Giờ vận động phù hợp nhiều năng lực",
    "Bữa ăn trường học làm gương thực tế",
    "Tránh biến giáo dục sức khỏe thành phán xét ngoại hình"
  ],
  "How does modern work affect well-being?": [
    "Ngồi lâu và màn hình gây mệt",
    "Tin nhắn ngoài giờ làm khó nghỉ ngơi",
    "Lịch linh hoạt có thể giúp cân bằng",
    "Người làm ca hoặc việc tay chân có khó khăn khác"
  ],
  "How often do you use social media?": [
    "Xem vài lần trong ngày để nhắn bạn",
    "Chỉ kiểm tra vào giờ nghỉ",
    "Dùng nhiều hơn khi theo dõi nhóm học",
    "Đôi khi lướt lâu hơn dự định"
  ],
  "What do you like to do online?": [
    "Tra cứu bài học và hướng dẫn",
    "Xem video giải trí ngắn",
    "Trao đổi trong nhóm cùng sở thích",
    "Mua đồ hoặc xem bản đồ khi cần"
  ],
  "Do you follow educational accounts?": [
    "Theo dõi người giải thích khoa học dễ hiểu",
    "Tài khoản dạy phát âm và từ vựng",
    "Kênh hướng dẫn lập trình có bài thực hành",
    "Kiểm tra chuyên môn thay vì tin vì nhiều người theo dõi"
  ],
  "Would you like to spend less time on your phone?": [
    "Muốn bớt lướt trước giờ ngủ",
    "Giữ điện thoại vì cần liên lạc",
    "Tắt thông báo ít quan trọng",
    "Đặt xa bàn khi học để bớt mở vô thức"
  ],
  "Describe a website or app you find helpful.": [
    "Ứng dụng ghi chú để lưu bài và việc cần làm",
    "Biết đến qua một người bạn",
    "Dùng mỗi sáng xem nhiệm vụ rồi cập nhật cuối ngày",
    "Một lần tìm lại ghi chú cũ giúp hoàn thành bài nhanh"
  ],
  "How has social media changed communication?": [
    "Tin tức và lời nhắn lan nhanh",
    "Người ở xa vẫn tham gia đời sống của nhau",
    "Bài ngắn dễ thiếu ngữ cảnh và gây tranh cãi",
    "Cuộc trò chuyện riêng có thể sâu hơn bình luận công khai"
  ],
  "How can people assess information online?": [
    "Xem ai đăng và bằng chứng đi kèm",
    "Đối chiếu với nguồn gốc hoặc nguồn độc lập",
    "Kiểm tra ngày và bối cảnh hình ảnh",
    "Tạm không chia sẻ khi chưa xác minh"
  ],
  "Should schools teach digital literacy?": [
    "Học sinh cần nhận diện quảng cáo và tin giả",
    "Hiểu quyền riêng tư và dấu vết số",
    "Thực hành kiểm chứng thông tin ngay trong bài học",
    "Giáo viên cũng cần được cập nhật kỹ năng"
  ],
  "How can users better protect their privacy?": [
    "Kiểm soát người xem bài và thông tin cá nhân",
    "Bật xác thực nhiều bước",
    "Cẩn thận đường link yêu cầu đăng nhập",
    "Xóa quyền ứng dụng không còn dùng"
  ],
  "What is the weather like in your hometown?": [
    "Nóng ẩm phần lớn thời gian",
    "Mùa mưa có mưa lớn buổi chiều",
    "Buổi sáng dễ chịu hơn giữa trưa",
    "Nhiệt độ khác giữa khu trung tâm và nơi nhiều cây"
  ],
  "Which season do you prefer?": [
    "Thích mùa khô vì dễ đi chơi",
    "Mùa mát giúp ngủ và vận động thoải mái",
    "Thích tiếng mưa nhưng ngại đường ngập",
    "Một mùa gắn với kỳ nghỉ bạn mong chờ"
  ],
  "Does the weather affect your plans?": [
    "Mưa khiến đổi sân ngoài trời sang trong nhà",
    "Nắng nóng làm bạn đi sớm hơn",
    "Mang áo mưa và xem dự báo trước chuyến xa",
    "Việc gần nhà ít bị ảnh hưởng hơn"
  ],
  "Have you experienced unusual weather recently?": [
    "Một đợt mưa trái mùa",
    "Ngày nóng hơn mức bạn quen",
    "Đường ngập làm đi lại chậm",
    "Chỉ mô tả điều đã trải qua, không suy từ một ngày ra toàn khí hậu"
  ],
  "Describe a day when the weather changed your plans.": [
    "Dự định dã ngoại cuối tuần với bạn",
    "Mưa lớn bắt đầu trước giờ đi",
    "Cả nhóm chuyển sang nấu ăn tại nhà",
    "Ban đầu hụt hẫng nhưng cuối cùng vẫn vui"
  ],
  "How does climate affect daily life?": [
    "Khí hậu ảnh hưởng giờ làm và hoạt động ngoài trời",
    "Nhà ở cần thông gió hoặc giữ ấm phù hợp",
    "Nông nghiệp phụ thuộc mùa mưa và nhiệt độ",
    "Người thu nhập thấp ít khả năng điều chỉnh điều kiện sống"
  ],
  "Why are weather forecasts important?": [
    "Người dân chuẩn bị quần áo và đường đi",
    "Nông dân quyết định thời điểm thu hoạch",
    "Cảnh báo sớm hỗ trợ sơ tán",
    "Dự báo có độ bất định nên cần cập nhật thường xuyên"
  ],
  "How should cities prepare for extreme weather?": [
    "Thoát nước và nơi trú tránh đủ sức đáp ứng",
    "Cảnh báo dễ hiểu tới cả người ít dùng mạng",
    "Bảo vệ người già và người làm việc ngoài trời",
    "Quy hoạch tránh xây ở vùng rủi ro cao"
  ],
  "What can communities do to adapt to climate change?": [
    "Trồng cây và giữ khu vực thấm nước",
    "Lập nhóm hỗ trợ khi ngập hoặc nắng nóng",
    "Điều chỉnh cây trồng phù hợp nguồn nước",
    "Giải pháp địa phương cần phối hợp với chính quyền"
  ],
  "Do you like animals?": [
    "Thích quan sát hành vi thú cưng",
    "Yêu động vật nhưng dè chừng con lớn",
    "Quan tâm chim và động vật hoang dã",
    "Thích xem từ khoảng cách an toàn"
  ],
  "Have you ever had a pet?": [
    "Từng nuôi mèo hoặc chó trong gia đình",
    "Giúp chăm thú cưng của người thân",
    "Chưa nuôi vì nhà chật hoặc lịch bận",
    "Muốn chuẩn bị thời gian trước khi nhận nuôi"
  ],
  "What animals are common where you live?": [
    "Chó và mèo quanh khu dân cư",
    "Chim ở công viên",
    "Gia súc ở vùng quê gần nhà",
    "Môi trường sống quyết định loại dễ gặp"
  ],
  "Would you like to visit a wildlife reserve?": [
    "Muốn xem động vật trong môi trường gần tự nhiên",
    "Tò mò cách khu bảo tồn chăm sóc và bảo vệ",
    "Quan tâm quy định giữ khoảng cách",
    "Chọn nơi đặt phúc lợi động vật lên trước giải trí"
  ],
  "Describe an animal you find interesting.": [
    "Loài voi với trí nhớ và quan hệ đàn",
    "Biết đến qua phim tài liệu",
    "Ấn tượng khi voi chăm sóc con non",
    "Muốn hiểu vì sao môi trường sống của chúng cần được bảo vệ"
  ],
  "Why should endangered species be protected?": [
    "Mỗi loài có vai trò trong hệ sinh thái",
    "Mất loài thường không thể đảo ngược",
    "Bảo vệ sinh cảnh giúp nhiều loài cùng lúc",
    "Cần tính sinh kế của người sống gần khu bảo tồn"
  ],
  "What responsibilities come with owning a pet?": [
    "Thức ăn, vận động và khám thú y",
    "Dành thời gian huấn luyện nhẹ nhàng",
    "Giữ vệ sinh và tránh làm phiền hàng xóm",
    "Cam kết nhiều năm chứ không chỉ lúc thú cưng còn nhỏ"
  ],
  "How can children learn to respect animals?": [
    "Người lớn làm gương chăm sóc tử tế",
    "Học đọc dấu hiệu sợ hoặc khó chịu của con vật",
    "Quan sát mà không đuổi bắt",
    "Hoạt động phù hợp tuổi và có giám sát"
  ],
  "Should cities provide more animal-friendly spaces?": [
    "Khu dắt chó giúp thú cưng vận động",
    "Người không nuôi cũng cần không gian sạch, an toàn",
    "Phân khu và quy định thu gom chất thải",
    "Bảo vệ động vật hoang dã trong công viên"
  ],
  "What clothes do you usually wear?": [
    "Áo thun và quần jeans dễ vận động",
    "Đồng phục khi đi học",
    "Trang phục gọn nhẹ hợp thời tiết",
    "Đổi sang lịch sự khi có dịp cần"
  ],
  "Do you choose clothes for comfort or style?": [
    "Thoải mái để ngồi học cả ngày",
    "Kiểu dáng giúp bạn tự tin",
    "Chọn đồ vừa vặn để có cả hai",
    "Giày đẹp nhưng đau chân thường ít được dùng"
  ],
  "Have your clothing preferences changed?": [
    "Trước đây chọn màu nổi theo bạn bè",
    "Bây giờ ưu tiên đồ dễ phối",
    "Lịch học hoặc công việc làm gu thay đổi",
    "Vẫn giữ một kiểu quen thuộc lâu năm"
  ],
  "Do you like traditional clothes?": [
    "Áo dài đẹp và gắn với dịp lễ",
    "Trang phục truyền thống thể hiện nghề thủ công",
    "Ít mặc hằng ngày vì bất tiện",
    "Thiết kế cải tiến có thể dễ sử dụng hơn"
  ],
  "Describe an item of clothing you wear on special occasions.": [
    "Chiếc áo dài mặc lễ tốt nghiệp",
    "Màu nhã, đường may đơn giản",
    "Gia đình cùng chọn hoặc đặt may",
    "Mỗi lần mặc nhớ đến một cột mốc quan trọng"
  ],
  "How does fashion reflect cultural identity?": [
    "Chất liệu và họa tiết gắn với vùng miền",
    "Trang phục dùng trong dịp lễ thể hiện truyền thống",
    "Người trẻ phối cách cũ với phong cách mới",
    "Không nên suy tính cách chỉ từ quần áo"
  ],
  "What are the environmental impacts of fast fashion?": [
    "Sản xuất nhiều làm tăng tài nguyên sử dụng",
    "Đồ mau hỏng tạo rác thải",
    "Nhuộm và xử lý vải có thể gây ô nhiễm",
    "Mua ít, sửa và dùng lâu giúp giảm nhu cầu"
  ],
  "Why do fashion trends change quickly?": [
    "Mạng xã hội lan hình ảnh rất nhanh",
    "Nhãn hàng liên tục tạo cảm giác mới",
    "Người mua muốn thể hiện bản thân",
    "Một số kiểu cơ bản vẫn tồn tại lâu"
  ],
  "Should workplaces have dress codes?": [
    "Quy định có thể hỗ trợ an toàn và nhận diện",
    "Ngành sáng tạo có thể cho linh hoạt hơn",
    "Yêu cầu quá chặt làm tăng chi phí hoặc bất tiện",
    "Tiêu chuẩn nên rõ, công bằng và phù hợp công việc"
  ],
  "Do you enjoy visiting museums?": [
    "Thích xem đồ vật thật hơn đọc ảnh",
    "Đi bảo tàng khi du lịch",
    "Ít đi vì xa hoặc giờ mở cửa không phù hợp",
    "Triển lãm tương tác khiến bạn muốn ghé hơn"
  ],
  "Did you study art at school?": [
    "Từng vẽ hoặc làm thủ công trong lớp",
    "Thích phần tự chọn ý tưởng",
    "Không tự tin vẽ nhưng thích quan sát",
    "Một bài tập còn giữ đến bây giờ"
  ],
  "What kinds of art do you like?": [
    "Tranh phong cảnh có màu dịu",
    "Nhiếp ảnh đời thường",
    "Điêu khắc hoặc đồ gốm thủ công",
    "Tác phẩm có câu chuyện dễ kết nối"
  ],
  "Are there public artworks in your city?": [
    "Bức tranh tường gần trường",
    "Tượng ở quảng trường hoặc công viên",
    "Tác phẩm làm một góc phố dễ nhớ",
    "Muốn có bảng giải thích để hiểu thêm"
  ],
  "Describe an artwork that impressed you.": [
    "Bức tranh về một khu phố cũ ở triển lãm",
    "Màu sắc gợi ánh sáng cuối chiều",
    "Một chi tiết nhỏ giống nơi bạn từng sống",
    "Bạn đứng lại lâu vì cảm giác quen thuộc"
  ],
  "Why should governments support museums?": [
    "Bảo tàng gìn giữ hiện vật khó thay thế",
    "Học sinh tiếp cận lịch sử ngoài sách",
    "Vé phù hợp giúp nhiều nhóm tham quan",
    "Kinh phí cần minh bạch và chương trình có ích"
  ],
  "How can public art improve cities?": [
    "Nơi công cộng có bản sắc riêng",
    "Tác phẩm tạo chủ đề trò chuyện",
    "Nghệ sĩ địa phương có cơ hội đóng góp",
    "Cần hỏi cộng đồng và tính chi phí bảo trì"
  ],
  "What is the role of art education?": [
    "Trẻ thử cách diễn đạt ngoài lời nói",
    "Học quan sát và chấp nhận nhiều cách nhìn",
    "Quá trình làm quan trọng hơn vẽ giống mẫu",
    "Vật liệu và giáo viên tốt giúp tiếp cận công bằng"
  ],
  "How do digital technologies change the way people experience art?": [
    "Tham quan trực tuyến mở cửa cho người ở xa",
    "Phóng to tác phẩm để xem chi tiết",
    "Công nghệ tương tác tạo trải nghiệm mới",
    "Màn hình chưa thay thế cảm giác về kích thước và chất liệu"
  ],
  "Have you ever helped at a community event?": [
    "Giúp dọn rác sau sự kiện trường",
    "Sắp xếp bàn ghế hoặc phát nước",
    "Chỉ hỗ trợ việc nhỏ vì chưa có kinh nghiệm",
    "Một lần làm cùng bạn khiến bạn bớt ngại"
  ],
  "Do people volunteer in your area?": [
    "Nhóm dọn vệ sinh cuối tuần",
    "Quyên góp sách cho học sinh",
    "Hỗ trợ người già trong khu phố",
    "Hoạt động thường do trường hoặc tổ dân phố tổ chức"
  ],
  "What causes are important to you?": [
    "Cơ hội học tập cho trẻ",
    "Giữ môi trường khu dân cư sạch",
    "Chăm sóc động vật bị bỏ rơi",
    "Chọn vấn đề gần trải nghiệm của bản thân"
  ],
  "Would you like to volunteer in the future?": [
    "Muốn dạy kèm hoặc hỗ trợ thư viện",
    "Có thể tham gia vài giờ cuối tuần",
    "Cần hiểu kỹ nhiệm vụ và thời gian",
    "Chọn tổ chức minh bạch và phù hợp kỹ năng"
  ],
  "Describe a time you helped someone.": [
    "Giúp bạn mới hiểu bài trước kỳ kiểm tra",
    "Hai người hẹn tại thư viện",
    "Bạn chia bài thành phần nhỏ và cùng luyện",
    "Vui khi bạn ấy tự làm được bài sau đó"
  ],
  "Why do people choose to volunteer?": [
    "Muốn đóng góp vào vấn đề mình quan tâm",
    "Tìm cộng đồng và cảm giác có ích",
    "Học kỹ năng từ trải nghiệm thực tế",
    "Động cơ khác nhau nhưng cần tôn trọng người nhận hỗ trợ"
  ],
  "Should schools encourage community service?": [
    "Hoạt động giúp học sinh hiểu cộng đồng",
    "Có thể phát triển trách nhiệm và hợp tác",
    "Bắt buộc quá nhiều dễ thành làm cho đủ giờ",
    "Nên có lựa chọn và phản hồi về tác động thật"
  ],
  "How do charities build public trust?": [
    "Công khai thu chi và mục đích sử dụng",
    "Báo cáo kết quả cụ thể thay hình ảnh cảm động",
    "Có kênh tiếp nhận khiếu nại",
    "Tôn trọng riêng tư của người được giúp"
  ],
  "What can local governments do to support volunteers?": [
    "Cung cấp địa điểm và thông tin nhu cầu",
    "Đào tạo an toàn và kỹ năng cần thiết",
    "Kết nối nhóm để tránh làm trùng việc",
    "Hỗ trợ chi phí di chuyển cho người có ít nguồn lực"
  ],
  "What languages would you like to learn?": [
    "Tiếng Anh cho học tập và công việc",
    "Tiếng Nhật vì thích văn hóa hoặc truyện",
    "Ngôn ngữ của nơi muốn đi du lịch",
    "Tập trung một ngôn ngữ trước để tiến bộ rõ"
  ],
  "How do you practise English speaking?": [
    "Tự nói về một ngày của mình",
    "Ghi âm rồi nghe lại đoạn ngắn",
    "Luyện cùng bạn theo câu hỏi cụ thể",
    "Dùng từ đã biết thay vì cố câu quá khó"
  ],
  "Do you find pronunciation challenging?": [
    "Khó với âm cuối hoặc trọng âm",
    "Nghe được nhưng nói chưa quen",
    "Luyện từng cặp âm và câu ngắn",
    "Ưu tiên nói rõ hơn bắt chước giọng hoàn hảo"
  ],
  "Have you ever used language-learning apps?": [
    "Ứng dụng giúp duy trì vài phút mỗi ngày",
    "Nhắc ôn từ đã quên",
    "Bài ngắn dễ học khi đi xe buýt",
    "Vẫn cần hội thoại thật để phản ứng tự nhiên"
  ],
  "Describe a useful language-learning experience.": [
    "Một lần hướng dẫn đường cho khách bằng tiếng Anh",
    "Ban đầu lo vì nghe chưa hết câu",
    "Hỏi lại chậm hơn rồi dùng bản đồ hỗ trợ",
    "Bạn nhận ra giao tiếp rõ quan trọng hơn câu hoàn hảo"
  ],
  "Why is learning a second language valuable?": [
    "Tiếp cận thông tin và cơ hội học tập",
    "Hiểu người có nền văn hóa khác",
    "Du lịch và hợp tác thuận tiện hơn",
    "Giá trị còn nằm ở giao tiếp hằng ngày, không chỉ lương"
  ],
  "Should children start learning languages early?": [
    "Tiếp xúc sớm có thể giúp quen âm thanh",
    "Trẻ học tốt qua chơi và tương tác",
    "Chất lượng môi trường quan trọng hơn bắt đầu thật sớm",
    "Không nên tạo áp lực thi cử quá sớm"
  ],
  "Can technology replace language teachers?": [
    "Ứng dụng cung cấp luyện tập thường xuyên",
    "Công cụ có thể phản hồi nhanh",
    "Giáo viên hiểu động lực và khó khăn cá nhân",
    "Kết hợp công cụ với hướng dẫn phù hợp thường hữu ích"
  ],
  "How can people maintain motivation when learning?": [
    "Đặt mục tiêu nhỏ gắn với việc muốn làm",
    "Chọn nội dung mình thích",
    "Nhìn lại bản ghi cũ để thấy tiến bộ",
    "Chấp nhận giai đoạn chậm và thay cách học khi cần"
  ],
  "Is there a public library near you?": [
    "Thư viện gần trường hơn gần nhà",
    "Có khu đọc và chỗ mượn sách",
    "Chưa có thư viện thuận tiện trong khu",
    "Muốn giờ mở cửa muộn hơn để dễ đến"
  ],
  "Where do people in your area like to meet?": [
    "Công viên vào buổi chiều",
    "Quán nước gần chợ",
    "Sân sinh hoạt khu dân cư",
    "Nơi dễ đến và ít tốn tiền thường đông"
  ],
  "Do you spend time in public parks?": [
    "Đi dạo hoặc tập nhẹ cuối tuần",
    "Ngồi đọc sách dưới bóng cây",
    "Gặp bạn để trò chuyện",
    "Ít đến nếu công viên xa hoặc thiếu đèn"
  ],
  "What public place could be improved?": [
    "Trạm xe buýt cần mái che",
    "Công viên cần nhà vệ sinh sạch",
    "Thư viện cần thêm bàn và ổ điện",
    "Vỉa hè cần lối đi thông thoáng"
  ],
  "Describe a public place that people enjoy visiting.": [
    "Công viên nhỏ giữa khu dân cư",
    "Người già tập sáng, trẻ chơi chiều",
    "Cuối tuần có nhiều gia đình đi bộ",
    "Nơi miễn phí giúp hàng xóm có dịp gặp nhau"
  ],
  "What makes a city comfortable to live in?": [
    "Dịch vụ thiết yếu ở gần nơi ở",
    "Đường an toàn cho đi bộ",
    "Nhà ở phù hợp thu nhập",
    "Cây xanh và nơi gặp gỡ tạo chất lượng sống"
  ],
  "Why are free public spaces important?": [
    "Người ít tiền vẫn có nơi nghỉ và giao lưu",
    "Trẻ em có chỗ chơi ngoài nhà",
    "Các nhóm khác nhau gặp nhau tự nhiên",
    "Cần ngân sách bảo trì để không gian thật sự dùng được"
  ],
  "Should cities invest more in libraries?": [
    "Thư viện cung cấp sách và mạng cho người thiếu điều kiện",
    "Có thể là nơi học, sinh hoạt và hỗ trợ kỹ năng",
    "Nhu cầu địa phương quyết định dịch vụ cần đầu tư",
    "Giờ mở và vị trí quan trọng không kém tòa nhà đẹp"
  ],
  "How can public places become more accessible?": [
    "Đường dốc và lối đi đủ rộng",
    "Biển chỉ dẫn rõ, dễ đọc",
    "Ghế nghỉ và nhà vệ sinh phù hợp",
    "Mời người khuyết tật thử và góp ý trước khi hoàn thiện"
  ],
  "Do you keep old photographs?": [
    "Ảnh gia đình trong điện thoại",
    "Album giấy của cha mẹ",
    "Sao lưu ảnh để tránh mất",
    "Thích xem lại ảnh các dịp đoàn tụ"
  ],
  "Is there something you have owned for a long time?": [
    "Chiếc cặp hoặc đồng hồ dùng nhiều năm",
    "Một món quà từ người thân",
    "Đồ vẫn bền nên chưa cần đổi",
    "Vết xước gợi lại lần sử dụng đáng nhớ"
  ],
  "Do you prefer practical or sentimental gifts?": [
    "Quà thực tế vì dùng hằng ngày",
    "Quà có câu chuyện khiến bạn xúc động",
    "Một món nhỏ có thể vừa hữu ích vừa ý nghĩa",
    "Tùy người tặng và dịp tặng"
  ],
  "What things remind you of childhood?": [
    "Đồ chơi cũ hoặc truyện tranh",
    "Mùi món ăn quen của gia đình",
    "Tấm ảnh lớp tiểu học",
    "Đường đến trường ngày trước"
  ],
  "Describe an object that is important to you.": [
    "Chiếc đồng hồ được tặng lúc tốt nghiệp",
    "Người thân chọn vì biết bạn thích đồ đơn giản",
    "Cất trong hộp khi không dùng",
    "Nó nhắc bạn về sự tin tưởng của người tặng"
  ],
  "Why do people keep sentimental objects?": [
    "Đồ vật làm ký ức trở nên cụ thể",
    "Kết nối với người không còn ở gần",
    "Gợi cảm giác liên tục khi cuộc sống thay đổi",
    "Không phải ai cũng cần giữ nhiều đồ để nhớ"
  ],
  "How have digital photos changed the way we remember events?": [
    "Chụp nhiều và chia sẻ ngay dễ hơn",
    "Tìm ảnh theo ngày hoặc địa điểm",
    "Quá nhiều ảnh khiến ít xem kỹ từng tấm",
    "Sao lưu quan trọng vì dữ liệu vẫn có thể mất"
  ],
  "Should museums preserve ordinary household items?": [
    "Đồ dùng thường ngày cho thấy đời sống thật",
    "Lịch sử không chỉ thuộc người nổi tiếng",
    "Không thể giữ mọi thứ vì giới hạn chỗ và chi phí",
    "Chọn hiện vật tiêu biểu kèm câu chuyện sử dụng"
  ],
  "Can experiences be more valuable than possessions?": [
    "Chuyến đi hoặc buổi gặp tạo kỷ niệm chung",
    "Đồ dùng tốt có thể hỗ trợ trải nghiệm lâu dài",
    "Giá trị tùy hoàn cảnh và nhu cầu cơ bản",
    "Không nên coi chi nhiều cho trải nghiệm là tự động tốt hơn"
  ],
  "What skill would you like to improve?": [
    "Thuyết trình để đỡ ngại trước lớp",
    "Nấu ăn để tự lập hơn",
    "Lập trình để xây dự án nhỏ",
    "Chọn một kỹ năng có cơ hội dùng hằng tuần"
  ],
  "Do you enjoy making things?": [
    "Làm đồ thủ công để tặng bạn",
    "Viết một trang web đơn giản",
    "Nấu món mới từ nguyên liệu sẵn có",
    "Thích nhìn ý tưởng thành thứ dùng được"
  ],
  "How do you learn practical skills?": [
    "Xem một hướng dẫn rồi thử ngay",
    "Chia nhiệm vụ thành bước nhỏ",
    "Nhờ người có kinh nghiệm sửa lỗi",
    "Lặp lại trên một sản phẩm thật"
  ],
  "Have you tried a creative hobby?": [
    "Từng thử vẽ hoặc chụp ảnh",
    "Tập viết truyện ngắn",
    "Chơi nhạc với vài hợp âm",
    "Không cần giỏi ngay để thấy vui"
  ],
  "Describe a skill you learned recently.": [
    "Học chỉnh sửa video cho bài nhóm",
    "Xem hướng dẫn rồi ghép đoạn thử",
    "Khó nhất là đồng bộ âm thanh với hình",
    "Sau vài lần sửa, hoàn thành clip khiến cả nhóm hài lòng"
  ],
  "Why are practical skills important in education?": [
    "Học sinh biết áp dụng kiến thức vào việc thật",
    "Tự chăm sóc bản thân và xử lý việc thường ngày",
    "Thực hành giúp người học tìm điểm mạnh",
    "Cần cân bằng với kiến thức nền và thời gian học"
  ],
  "How can people stay creative at work?": [
    "Có khoảng thời gian thử ý tưởng nhỏ",
    "Trao đổi với người khác chuyên môn",
    "Chấp nhận bản nháp chưa hoàn hảo",
    "Môi trường phạt mọi sai sót sẽ làm sáng tạo khó hơn"
  ],
  "Is it easier to learn new skills as a child?": [
    "Trẻ có thời gian và ít sợ thử sai trong vài lĩnh vực",
    "Người lớn có mục tiêu và kinh nghiệm liên quan",
    "Cơ hội luyện và phản hồi rất quan trọng",
    "Không nên xem tuổi là rào cản tuyệt đối"
  ],
  "How can communities support lifelong learning?": [
    "Lớp ngắn ở thư viện hoặc trung tâm cộng đồng",
    "Chia sẻ kỹ năng giữa các thế hệ",
    "Học phí thấp và giờ học linh hoạt",
    "Thiết bị dùng chung giúp người mới bắt đầu"
  ],
  "What is your favourite room at home?": [
    "Phòng ngủ vì yên tĩnh",
    "Bếp vì cả nhà thường ở đó",
    "Góc phòng khách có ánh sáng tự nhiên",
    "Nơi phù hợp hoạt động bạn thích nhất"
  ],
  "Do you like decorating your room?": [
    "Thêm cây nhỏ hoặc ảnh bạn tự chụp",
    "Sắp lại bàn để thoáng hơn",
    "Giữ đơn giản cho dễ dọn",
    "Ngân sách hạn chế nên tận dụng đồ sẵn có"
  ],
  "Do you prefer modern or traditional furniture?": [
    "Đồ hiện đại gọn, dễ phối",
    "Đồ truyền thống có chất liệu và kỷ niệm",
    "Kết hợp một món cũ với cách bố trí mới",
    "Kích thước và độ bền quan trọng hơn nhãn phong cách"
  ],
  "Would you like to change anything about your home?": [
    "Thêm ánh sáng cho góc học",
    "Bớt đồ để có khoảng trống",
    "Cải thiện thông gió khi trời nóng",
    "Thay đổi nhỏ phù hợp nhà thuê hoặc ngân sách"
  ],
  "Describe a room where you feel comfortable.": [
    "Góc phòng ngủ cạnh cửa sổ",
    "Có bàn gỗ, kệ sách và đèn ánh sáng dịu",
    "Buổi tối đọc hoặc nghe nhạc tại đó",
    "Không gian gọn khiến bạn dễ tập trung và nghỉ ngơi"
  ],
  "How do housing needs change with age?": [
    "Người trẻ cần nhà gần học hoặc làm",
    "Gia đình có con cần không gian và dịch vụ",
    "Người lớn tuổi cần ít bậc thang và gần y tế",
    "Nhà linh hoạt có thể thích nghi qua nhiều giai đoạn"
  ],
  "Why do people care about interior design?": [
    "Cách sắp xếp ảnh hưởng thuận tiện hằng ngày",
    "Màu sắc và ánh sáng ảnh hưởng cảm giác",
    "Nhà thể hiện sở thích và ký ức cá nhân",
    "Thiết kế đẹp không nhất thiết tốn nhiều tiền"
  ],
  "How can homes become more environmentally friendly?": [
    "Tăng thông gió và che nắng phù hợp khí hậu",
    "Thiết bị tiết kiệm điện và nước",
    "Vật liệu bền, dễ sửa",
    "Chi phí đầu tư cần cân với khoản tiết kiệm lâu dài"
  ],
  "Should cities encourage smaller living spaces?": [
    "Nhà nhỏ có thể giảm giá và lượng tài nguyên sử dụng",
    "Ở gần dịch vụ giúp bớt đi lại",
    "Quá chật ảnh hưởng sinh hoạt của gia đình đông người",
    "Nên có nhiều lựa chọn và tiêu chuẩn diện tích phù hợp"
  ],
  "What games did you enjoy as a child?": [
    "Trốn tìm với trẻ trong xóm",
    "Đá bóng bằng quả bóng nhỏ",
    "Xếp hình hoặc vẽ tại nhà",
    "Trò chơi gắn với người cùng chơi hơn luật phức tạp"
  ],
  "Did you spend much time outside when you were younger?": [
    "Chơi ngoài sân sau giờ học",
    "Đạp xe quanh khu có người lớn trông",
    "Ở trong nhà nhiều vì thiếu chỗ an toàn",
    "Mùa mưa làm thời gian chơi ngoài trời ít hơn"
  ],
  "What is your earliest school memory?": [
    "Ngày đầu được người thân đưa đến lớp",
    "Làm quen bạn ngồi cạnh",
    "Một cô giáo nhớ tên và giúp bạn bớt sợ",
    "Âm thanh sân trường hoặc chiếc cặp mới còn rõ"
  ],
  "Do you still visit places from your childhood?": [
    "Thỉnh thoảng ghé trường cũ",
    "Về quê trong dịp lễ",
    "Một nơi đã thay đổi đến khó nhận ra",
    "Vẫn thấy gắn bó dù ít có dịp quay lại"
  ],
  "Describe a happy memory from your childhood.": [
    "Một chiều hè học đi xe đạp",
    "Người thân giữ yên rồi dần buông tay",
    "Bạn đạp được một đoạn và quay lại cười",
    "Nhớ cảm giác vừa lo vừa tự hào hơn món quà nào"
  ],
  "How have childhood experiences changed over time?": [
    "Trẻ tiếp cận màn hình và thông tin sớm hơn",
    "Ít tự do chơi ngoài đường ở nơi đông xe",
    "Nhiều lớp học có tổ chức hơn",
    "Trải nghiệm khác nhau theo điều kiện gia đình và nơi ở"
  ],
  "Why is play important for children?": [
    "Chơi giúp thử ý tưởng và giải quyết vấn đề",
    "Trẻ học thương lượng khi chơi cùng nhau",
    "Vận động và nghỉ ngơi đều cần thiết",
    "Cần thời gian chơi tự do bên cạnh hoạt động có hướng dẫn"
  ],
  "How can families create meaningful memories?": [
    "Làm việc nhỏ cùng nhau đều đặn",
    "Lắng nghe và để trẻ tham gia chọn hoạt động",
    "Một buổi nấu ăn có thể đáng nhớ hơn chuyến đắt tiền",
    "Tránh dành toàn bộ thời gian để chụp ảnh hoặc lên lịch"
  ],
  "Do modern children have enough free time?": [
    "Một số trẻ có lịch học thêm dày",
    "Thiết bị chiếm phần thời gian còn lại",
    "Những trẻ phải phụ giúp gia đình có áp lực khác",
    "Cần xem lịch thực tế thay vì cho rằng tất cả đều thiếu thời gian"
  ],
  "Do you like making plans?": [
    "Kế hoạch giúp đỡ quên việc",
    "Chỉ lên các mốc chính để còn linh hoạt",
    "Thích ghi ra giấy hơn giữ trong đầu",
    "Không muốn lịch kín từng phút"
  ],
  "What would you like to achieve this year?": [
    "Hoàn thành một khóa học hoặc chứng chỉ",
    "Làm dự án cá nhân nhỏ",
    "Duy trì thói quen vận động",
    "Mục tiêu vừa sức với lịch hiện tại"
  ],
  "Do you use a calendar?": [
    "Lịch điện thoại nhắc hạn nộp",
    "Sổ tay giúp nhìn cả tuần",
    "Ghi việc cố định và để khoảng trống",
    "Xem lại lịch vào đầu ngày"
  ],
  "Do your plans often change?": [
    "Thay đổi khi có việc gia đình",
    "Ước lượng thời gian chưa đúng",
    "Bạn bè đổi lịch hẹn",
    "Chuẩn bị phương án thay thế cho việc quan trọng"
  ],
  "Describe a goal you worked hard to achieve.": [
    "Mục tiêu thuyết trình tự tin trước lớp",
    "Bắt đầu vì thường nói quá nhanh khi lo",
    "Luyện từng đoạn, ghi âm và nhờ bạn góp ý",
    "Buổi cuối chưa hoàn hảo nhưng bạn nói rõ và bình tĩnh hơn"
  ],
  "Why is goal-setting useful?": [
    "Mục tiêu giúp chọn việc ưu tiên",
    "Mốc nhỏ cho thấy tiến bộ",
    "Dễ điều chỉnh khi biết điều chưa hiệu quả",
    "Mục tiêu quá cứng có thể tạo áp lực không cần thiết"
  ],
  "Should young people plan their careers early?": [
    "Tìm hiểu sớm giúp biết kỹ năng cần học",
    "Thử nhiều lĩnh vực trước khi quyết định",
    "Ngành nghề thay đổi nên cần linh hoạt",
    "Gia đình nên hỗ trợ khám phá thay vì áp một lựa chọn"
  ],
  "How do people deal with unexpected changes?": [
    "Xác định việc còn kiểm soát được",
    "Chia vấn đề thành bước ngắn",
    "Nhờ hỗ trợ khi thiếu thông tin hoặc nguồn lực",
    "Điều chỉnh mục tiêu không đồng nghĩa bỏ cuộc"
  ],
  "Is success more about effort or opportunity?": [
    "Nỗ lực giúp tận dụng cơ hội và cải thiện kỹ năng",
    "Điều kiện gia đình và mạng lưới ảnh hưởng điểm xuất phát",
    "May mắn có thể mở cửa nhưng không bảo đảm kết quả",
    "Hỗ trợ tiếp cận giáo dục giúp cơ hội bớt chênh lệch"
  ]
};
  function normalize(text) {
    return String(text || '').replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();
  }
  var normalized = Object.create(null);
  Object.keys(byQuestion).forEach(function (question) {
    normalized[normalize(question)] = byQuestion[question];
  });
  global.BandRoomIdeas = {
    forQuestion: function (question, topic, part) {
      var ideas = normalized[normalize(question)];
      return ideas ? ideas.slice() : [];
    }
  };
})(window);
