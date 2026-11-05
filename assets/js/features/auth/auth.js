/* Firebase authentication and account grading history. */
(function (global) {
  "use strict";

  var mode = "unavailable", fbAuth = null, fbDb = null;
  try {
    if (global.firebaseConfig && global.firebase && global.firebase.initializeApp) {
      if (!global.firebase.apps.length) global.firebase.initializeApp(global.firebaseConfig);
      fbAuth = global.firebase.auth(); fbDb = global.firebase.firestore(); mode = "firebase";
    }
  } catch (e) { /* Show unavailable instead of creating a different local account. */ }
  function validEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e || ""); }
  function unavailable() { return Promise.reject(new Error("Không kết nối được Firebase. Kiểm tra mạng hoặc dùng trang luyện tập không đăng nhập.")); }
  /* ---------------- ĐĂNG KÝ ---------------- */
  function signUp(email, pw, confirm) {
    email = (email || "").trim().toLowerCase();
    if (!validEmail(email)) return Promise.reject(new Error("Email không hợp lệ."));
    if (!pw || pw.length < 6) return Promise.reject(new Error("Mật khẩu cần ít nhất 6 ký tự."));
    if (confirm != null && pw !== confirm) return Promise.reject(new Error("Mật khẩu nhập lại không khớp."));

    if (mode === "firebase") {
      return fbAuth.createUserWithEmailAndPassword(email, pw).then(function (cred) {
        var u = cred.user;
        // Sau đăng ký Firebase tự đăng nhập -> đăng xuất để buộc người dùng đăng nhập lại.
        return fbAuth.signOut().then(function () { return { uid: u.uid, email: u.email }; });
      }).catch(function (err) { throw new Error(mapFbError(err)); });
    }
    return unavailable();
  }


  function signIn(email, pw) {
    email = (email || "").trim().toLowerCase();
    if (!validEmail(email)) return Promise.reject(new Error("Email không hợp lệ."));
    if (!pw) return Promise.reject(new Error("Vui lòng nhập mật khẩu."));

    if (mode === "firebase") {
      return fbAuth.signInWithEmailAndPassword(email, pw).then(function (cred) {
        return { uid: cred.user.uid, email: cred.user.email };
      }).catch(function (err) { throw new Error(mapFbError(err)); });
    }
    return unavailable();
  }


  function signOut() {
    if (mode === "firebase") return fbAuth.signOut();
    return unavailable();
  }


  function currentUser() {
    if (mode === "firebase") {
      var u = fbAuth.currentUser;
      return u ? { uid: u.uid, email: u.email } : null;
    }
    return null;
  }
  function ready(cb) {
    if (mode === "firebase") {
      var off = fbAuth.onAuthStateChanged(function (u) {
        cb(u ? { uid: u.uid, email: u.email } : null);
      });
      return off;
    }
    setTimeout(function () { cb(null); }, 0);
    return function () {};
  }
  function onChange(cb) {
    if (mode === "firebase") return fbAuth.onAuthStateChanged(function (u) {
      cb(u ? { uid: u.uid, email: u.email } : null);
    });
    return function () {};
  }

  /* ---------------- LỊCH SỬ CHẤM BÀI ---------------- */
  function saveGrading(rec) {
    var u = currentUser();
    if (!u) return Promise.reject(new Error("Chưa đăng nhập."));
    var record = {
      mode: rec.mode || "part",
      part: (rec.part != null ? String(rec.part) : "?"),
      topic: rec.topic || "",
      overall: (rec.overall != null ? rec.overall : null),
      backend: rec.backend || "",
      report: rec.report || "",
      createdAt: Date.now()
    };
    if (mode === "firebase") {
      record.createdAtServer = global.firebase.firestore.FieldValue.serverTimestamp();
      return fbDb.collection("users").doc(u.uid).collection("gradings").add(record);
    }
    return unavailable();
  }

  function loadHistory() {
    var u = currentUser();
    if (!u) return Promise.resolve([]);
    if (mode === "firebase") {
      return fbDb.collection("users").doc(u.uid).collection("gradings")
        .orderBy("createdAt", "desc").limit(50).get().then(function (snap) {
          var out = [];
          snap.forEach(function (doc) { var d = doc.data(); d.id = doc.id; out.push(d); });
          return out;
        });
    }
    return Promise.resolve([]);
  }

  /* ---------------- dịch lỗi Firebase sang tiếng Việt ---------------- */
  function mapFbError(err) {
    var c = (err && err.code) || "";
    if (c === "auth/email-already-in-use") return "Email này đã được đăng ký.";
    if (c === "auth/invalid-email") return "Email không hợp lệ.";
    if (c === "auth/weak-password") return "Mật khẩu quá yếu (cần ≥ 6 ký tự).";
    if (c === "auth/user-not-found" || c === "auth/wrong-password" || c === "auth/invalid-credential")
      return "Email hoặc mật khẩu không đúng.";
    if (c === "auth/too-many-requests") return "Thử quá nhiều lần. Vui lòng chờ một lát rồi thử lại.";
    if (c === "auth/network-request-failed") return "Lỗi mạng — kiểm tra kết nối rồi thử lại.";
    return (err && err.message) ? err.message : "Có lỗi xảy ra.";
  }

  global.BRAuth = {
    mode: mode,
    ready: ready,
    onChange: onChange,
    currentUser: currentUser,
    signUp: signUp,
    signIn: signIn,
    signOut: signOut,
    saveGrading: saveGrading,
    loadHistory: loadHistory
  };
})(window);
