package com.bank.repository;

import com.bank.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    // Find user by username
    Optional<User> findByUsername(String username);

    // Remove user by username
    @Transactional
    @Modifying
    long deleteByUsername(String username);

    // Add user (persist or update)
    default User addUser(User user) {
        return save(user);
    }

    // Remove user by username
    default long removeUser(String username) {
        return deleteByUsername(username);
    }
}